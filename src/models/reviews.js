const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('reviews', {
    id: {
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.INTEGER,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.NUMBER,
    },
    description:{
      type: DataTypes.STRING,
    }
  });
};
