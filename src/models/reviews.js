const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('reviews', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    description:{
      type: DataTypes.STRING,
    },  
  },
  {
    timestamps: false
  });
};
