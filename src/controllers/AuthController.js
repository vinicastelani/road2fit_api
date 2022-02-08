const express = require("express")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const authConfig = require("../config/auth.json")
const User = require("../models/user")
const router = express.Router()

function gerarToken(id, secret) {
    return jwt.sign({ id: id }, secret, {
        expiresIn: 3600
    })
}

router.post("/register", async (req, res) => {
    const { email, id } = req.body

    try {
        if (await User.findOne({ email })) return res.status(400).send({ success: false, msg: "Usuário já cadastrado" })
        const user = await User.create(req.body)
        user.password = undefined
        return res.send({ success: true, user, token: gerarToken(id, authConfig.secret), msg: "Usuário cadastrado com sucesso!" })
    } catch (err) {
        return res.status(400).send({ success: false, msg: "Não foi possível criar o usuário." })
    }

})


router.post("/authentication", async (req, res) => {
    const { email, password, id } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user) return res.status(400).send({ success: false, msg: "Usuário não encontrado." })

    if (!await bcrypt.compare(password, user.password)) return res.status(400).send({ success: false, msg: "Senha inválida." })

    user.password = undefined
    const token = jwt.sign({ id: id }, authConfig.secret, {
        expiresIn: 3600
    })

    res.send({ success: true, user, token: gerarToken(id, authConfig.secret), msg: "Logado com sucesso!" })
})


module.exports = (app) => app.use('/auth', router)