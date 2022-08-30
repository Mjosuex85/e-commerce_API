const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('genre', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV4
    },
    imageBackground:{
      type: DataTypes.STRING,
    }
  });
};
