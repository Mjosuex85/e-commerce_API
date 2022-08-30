const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('products', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    background_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    released: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    screenshots: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trailer: {
      type: DataTypes.STRING,      
    },
    requeriments_recomended: {
      type: DataTypes.STRING,      
    },
    requeriments_min: {
      type: DataTypes.STRING,      
    }, 
    price: {
      type: DataTypes.STRING,      
    }, 
    isDisabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    onSale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    esrb_rating: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    genre_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    esrb_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },    
    
  });
};


// id
// // name
// description
// rating
// backgroun_image
// released
// screenshots
// trailer
// req.recomended
// prices
// req min

// isDisabled
// onSale
// esrb_rating
// genre_id
// esrb_rating_id