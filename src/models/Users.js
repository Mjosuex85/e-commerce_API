const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.INTEGER,
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
    },
    profile_pic:{
      type: DataTypes.STRING
    },
  });
};