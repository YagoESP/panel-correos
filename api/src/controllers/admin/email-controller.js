const db = require("../../models");
const EmailService = require("../../services/email-service");
const Email = db.Email;
const Customer = db.Customer;
const Op = db.Sequelize.Op;
const ImageService = require("../../services/image-service");


exports.create = (req, res) => {

    
    


    if (!req.body.subject ||!req.body.content) {

        res.status(400).send({
            message: "Faltan campos por rellenar."
        });

        return;
    }

    const email = {
        subject: req.body.subject,
        content: req.body.content
    };

    Email.create(email).then(data => {
        new ImageService('email', 1).uploadImage(req.files);

        res.status(200).send(data);

    }).catch(err => {

        res.status(500).send({
            message: err.message || "Algún error ha surgido al insertar el dato."
        });
    });
};

exports.findAll = (req, res) => {

    let whereStatement = {};

    let condition = Object.keys(whereStatement).length > 0 ? {[Op.and]: [whereStatement]} : {};

    Email.findAll({ where: condition }).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algún error ha surgido al recuperar los datos."
        });
    });
};

exports.findOne = (req, res) => {

    const id = req.params.id;

    Email.findByPk(id).then(async data => {

        if (data) {

            let images = await new ImageService('email', data.id).getImages();      

            data.dataValues.images = images;

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

    Email.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {

            new ImageService('email', data.id).deleteImages();  

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

    Email.destroy({
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

exports.sendEmail = async (req, res) => {
    
    let email = await Email.findByPk(req.body.id);
    let whereStatement = {};

    whereStatement.onService = true;

    if(req.body.postalCode)
        whereStatement.postalCode = {[Op.like]: `%${req.body.postalCode}%`};

    if(req.body.city)
        whereStatement.city = {[Op.like]: `%${req.body.city}%`};

    if(req.body.startingServiceDate)
        whereStatement.startingServiceDate = {[Op.gte]: req.body.startingServiceDate};

    let condition = Object.keys(whereStatement).length > 0 ? {[Op.and]: [whereStatement]} : {};

    Customer.findAll({ where: condition }).then(data => {
        
        data.forEach(customer => {
            new EmailService().sendEmail(email, customer);
        });

        res.status(200).send({
            message: "Emails enviados correctamente."
        });

    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algún error ha surgido al enviar los emails."
        });
    });
};