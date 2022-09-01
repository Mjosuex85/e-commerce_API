require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
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

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Products, Users, Reviews, Platforms, Order, Genre } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

// console.log(sequelize.models)

Products.belongsToMany(Users, { through: "Favorites", timestamps: false})
Users.belongsToMany(Products, { through: "Favorites", timestamps: false })

Products.belongsToMany(Users, { through: "Owned", timestamps: false})
Users.belongsToMany(Products, { through: "Owned", timestamps: false})

Products.belongsToMany(Order, { through: "OrderProduct", timestamps:false})
Order.belongsToMany(Products, { through: "OrderProduct", timestamps:false})

Products.belongsToMany(Platforms, { through: "PlatformGame", timestamps:false})
Platforms.belongsToMany(Products, { through: "PlatformGame", timestamps:false})

Users.belongsToMany(Reviews, { through: "UserReviews", timestamps:false})
Reviews.belongsToMany(Users, { through: "UserReviews", timestamps:false})

Genre.belongsToMany(Products, { through: "ProductGenre", timestamps:false})
Products.belongsToMany(Genre, { through: "ProductGenre", timestamps:false})



module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
