const express = require("express");
const cors = require('cors')
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);
app.use(cors())

require('./controllers/AuthController')(app)
require('./controllers/UsersController')(app)

app.get("/", (req, res) => {
    res.status(400).send({ msg: "API disponível" })
})

app.listen(process.env.PORT || 4000, () =>
    console.log(`server listening at port ${process.env.PORT}`)
);