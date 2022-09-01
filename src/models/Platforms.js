const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('platforms', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_background: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{timestamps: false});
};