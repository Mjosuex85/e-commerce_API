const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('UsedPlatforms', {
    name: {
      type: DataTypes.STRING,
    },
  }, {timestamps: false});
};