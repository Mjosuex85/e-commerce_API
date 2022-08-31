require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/videogames`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { Products, Users, Reviews, Platforms, Genre } = sequelize.models;

Products.belongsToMany(Users, { through: "Favorites"})
Users.belongsToMany(Products, { through: "Favorites"})

Products.belongsToMany(Users, { through: "Order"})
Users.belongsToMany(Products, { through: "Order"})

Products.belongsToMany(Platforms, { through: "PlatformGame"})
Platforms.belongsToMany(Products, { through: "PlatformGame"})

Products.hasMany(Reviews,{foreignKey: 'reviewID'})
Reviews.belongsTo(Products,)

Genre.belongsToMany(Products, { through: "ProductGenre"})
Products.belongsToMany(Genre, { through: "ProductGenre"})



module.exports = {
  ...sequelize.models, 
  conn: sequelize,  
};
