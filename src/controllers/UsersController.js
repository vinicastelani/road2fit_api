const express = require("express")
const authConfig = require("../config/auth.json")
const User = require("../models/user")
const router = express.Router()


function formatName(name) {
    return name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

router.get("/:string", async (req, res) => {
    try {

        const users = await User.find()
        return res
            .status(200)
            .send({
                msg: {
                    type: "success", msg: "Usuários encontrados com base na busca", data: users.filter(user => {
                        return formatName(user.name).includes(formatName(req.params.string))
                    }),

                }
            });
    } catch (err) {

        return res.status(400).send({ success: false, msg: "Não foi possível procurar por usuários." })
    }
})


module.exports = (app) => app.use('/user', router)