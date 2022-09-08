const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('Reviews', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    username:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    reported:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    timestamps: false
  });
};