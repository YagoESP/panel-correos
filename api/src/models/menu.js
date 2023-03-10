const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    const Menu = sequelize.define('Menu', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validator: {
                notNull: {
                    msg: 'Por favor, rellena el campo "Nombre".'
                }
            }
        }
    }, {
        sequelize,
        tableName: 'menus',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            }
        ]
    });

    Menu.associate = function(models) {
        Menu.hasMany(models.MenuItem, { as: "menuItems", foreignKey: "menuId"});
    };

    return Menu;
};