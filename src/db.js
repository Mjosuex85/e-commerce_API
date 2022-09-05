require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const getApiGames = require('./services/getApiGames');
const getApiPlatforms = require('./services/getApiPlatforms');
const getApiGenres = require('./services/getApiGenres');
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
} = process.env;


let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
        database: DB_NAME,
        dialect: "postgres",
        host: DB_HOST,
        port: 5432,
        username: DB_USER,
        password: DB_PASSWORD,
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            // Ref.: https://github.com/brianc/node-postgres/issues/2009
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/videogames`,
        { logging: false, native: false }
      );
      
/*const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@localhost/videogames`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});*/
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

const { Products, Users, Reviews, Platforms, Genre, Screenshots, AuthUsers } = sequelize.models;

Products.belongsToMany(Users, { through: "Favorites", timestamps: false})
Users.belongsToMany(Products, { through: "Favorites", timestamps: false })

Products.belongsToMany(AuthUsers, { through: "Favorites", timestamps: false})
AuthUsers.belongsToMany(Products, { through: "Favorites", timestamps: false })

Products.belongsToMany(Users, { through: "Order"})
Users.belongsToMany(Products, { through: "Order"})

Products.belongsToMany(AuthUsers, { through: "Order"})
AuthUsers.belongsToMany(Products, { through: "Order"})

Products.belongsToMany(Platforms, { through: "PlatformGame", timestamps:false})
Platforms.belongsToMany(Products, { through: "PlatformGame", timestamps:false})

Products.hasMany(Reviews,{foreignKey: 'reviewID'})
Reviews.belongsTo(Products,)

Genre.belongsToMany(Products, { through: "ProductGenre", timestamps:false})
Products.belongsToMany(Genre, { through: "ProductGenre", timestamps:false})

Screenshots.belongsToMany(Products, { through: "ProductScreenshot", timestamps:false})
Products.belongsToMany(Screenshots, { through: "ProductScreenshot", timestamps:false})

getApiGames(Products, Platforms, Genre, Screenshots);
getApiPlatforms(Platforms);
getApiGenres(Genre);

module.exports = {
  ...sequelize.models, 
  conn: sequelize,  
};
