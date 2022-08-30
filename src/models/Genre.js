const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('genre', {
    id: {
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageBackground:{
      type: DataTypes.STRING,
    }
  });
};