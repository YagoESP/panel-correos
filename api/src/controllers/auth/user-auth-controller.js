const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../models");
const config = require("../../config/auth-config");
const User = db.User;

exports.signin = (req, res) => {

    User.findOne({
        where: {
            email: req.body.email //busca un usuario con el email que le hallamos pasado
        }
    })
    .then(user => {

        if (!user) {

            return res.status(404).send({ message: "Usuario o contraseña incorrecta" }); // por seguridad
        }

        let passwordIsValid = bcrypt.compareSync(
            req.body.password, //comparar contraseñas al ingresarlas
            user.password
        );

        if (!passwordIsValid) {

            return res.status(404).send({
                accessToken: null,
                message: "Usuario o contraseña incorrecta"
            });
        }

        let token = jwt.sign({ id: user.id }, config.user.secret, {
            expiresIn: 86400 // generacion del tocken
        });

        res.status(200).send({ // darles respuesta al usuario
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: token
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};