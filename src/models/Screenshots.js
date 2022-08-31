const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('screenshots', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        },
    name:{
        type:DataTypes.STRING,
        defaultValue:"No Image avaiable"
    }
    })
};