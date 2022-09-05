const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('UsedGenre', {
    name: {
      type: DataTypes.STRING,
    },
  }, {timestamps: false});
};