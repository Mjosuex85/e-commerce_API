const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('Reviews', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    description:{
      type: DataTypes.STRING,
    },
    productId:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false
  });
};