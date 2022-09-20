const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('Screenshots', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },
    image:{
        type:DataTypes.STRING,
        defaultValue:"No Image avaiable"
    }
    })
};