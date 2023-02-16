const db = require("../../models");
const bcrypt = require("bcryptjs");
const User = db.User;
const Op = db.Sequelize.Op;
const ImageService = require("../../services/image-service");

exports.create = (req, res) => {

    if (!req.body.name || !req.body.email || !req.body.password) {
        
        res.status(400).send({
            message: "Faltan campos por rellenar."
        });

        return;
    }

    User.findOne({
        where: {
          email: req.body.email
        }
      }).then(data => {

        if (data) {
            
            res.status(400).send({
                message: "El email ya existe."
            });

        }else{

            const user = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
            };
       
            User.create(user).then(data => {

                new ImageService('user', data.id).uploadImage(req.files);

                res.status(200).send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Algún error ha surgido al insertar el dato."
                });
            });
        }  
    });
};

exports.findAll = (req, res) => {

    const id = req.query.id;
    var condition = id ? { [Op.and]: [{id: { [Op.like]: `%${id}%` }}]} : {};

    User.findAll({ where: condition }).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algún error ha surgido al recuperar los datos."
        });
    });
};

exports.findOne = (req, res) => {

    const id = req.params.id;

    User.findByPk(id).then(data => {

        if (data) {
            res.status(200).send(data);
        } else {
            res.status(404).send({
                message: `No se puede encontrar el elemento con la id=${id}.`
            });
        }

    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al recuperar la id=" + id
        });
    });
};

exports.update = (req, res) => {

    const id = req.params.id;

    User.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "El elemento ha sido actualizado correctamente."
            });
        } else {
            res.status(404).send({
                message: `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento o el cuerpo de la petición está vacío.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al actualiazar la id=" + id
        });
    });
};

exports.delete = (req, res) => {

    const id = req.params.id;

    User.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "El elemento ha sido borrado correctamente"
            });
        } else {
            res.status(404).send({
                message: `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al borrar la id=" + id
        });
    });
};