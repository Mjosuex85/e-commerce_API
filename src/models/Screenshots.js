const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('Screenshots', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        },
    name:{
        type:DataTypes.STRING,
        defaultValue:"No Image avaiable"
    }
    },
    {
        timestamps: false
    })
};