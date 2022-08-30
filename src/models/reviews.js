const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('reviews', {
    id: {
      type: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV4
    },
    rating: {
      type: DataTypes.NUMBER,
    },
    description:{
      type: DataTypes.STRING,
    }
  });
};
