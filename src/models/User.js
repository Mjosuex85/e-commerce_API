const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name:{
      type: DataTypes.STRING,
      allowNull:false,
    },
    lastname:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    }
  },
  {
    updatedAt: false,
    createdAt: true
  });
};