const db = require("../../models");
const Customer = db.Customer;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

    if (!req.body.name || !req.body.surname || !req.body.identifyNumber || !req.body.startingServiceDate) {

        res.status(400).send({
            message: "Faltan campos por rellenar."
        });

        return;
    }

    const customer = {
        name: req.body.name,
        surname: req.body.surname,
        identifyNumber: req.body.identifyNumber,
        startingServiceDate: req.body.startingServiceDate,
        onService: req.body.onService,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        postalCode: req.body.postalCode,
        city: req.body.city,
        province: req.body.surname,
        comment: req.body.comment
    };

    Customer.create(customer).then(data => {
        res.send(data);
    }).catch(err => {

        res.status(500).send({
            message: err.message || "Algún error ha surgido al insertar el dato."
        });
    });
};

exports.findAll = (req, res) => {

    let whereStatement = {};

    whereStatement.onService = true;

    if(req.query.postalCode)
        whereStatement.postalCode = {[Op.like]: `%${req.query.postalCode}%`};

    if(req.query.city)
        whereStatement.city = {[Op.like]: `%${req.query.city}%`};

    if(req.query.startingServiceDate)
        whereStatement.startingServiceDate = {[Op.gte]: req.query.startingServiceDate};

    const name = req.query.name;
    var condition = name ? { [Op.and]: [{name: { [Op.like]: `%${name}%` }, deletedAt: null }]} : {deletedAt: null};
 
    Customer.findAll({ where: condition }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algún error ha surgido al recuperar los datos."
        });
    });
};

exports.findOne = (req, res) => {

    const id = req.params.id;

    Customer.findByPk(id, {where: {deletedAt: null}}).then(data => {

        if (data) {
            res.send(data);
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

    Customer.update(req.body, {
        where: { [Op.and]: [{id: id} , {deletedAt: null}] }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "El elemento ha sido actualizado correctamente."
            });
        } else {
            res.send({
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

    Customer.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "El elemento ha sido borrado correctamente"
            });
        } else {
            res.send({
                message: `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al borrar la id=" + id
        });
    });
};