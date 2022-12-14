const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('AuthUsers', {
    id:{
      type: DataTypes.STRING,
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
    profile_pic:{
      type: DataTypes.STRING,
      defaultValue:'undefined'
    },
    isBanned:{
      type: DataTypes.BOOLEAN, 
      defaultValue: false
    },
    isAdmin:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  },{
    updatedAt: false
  });
};