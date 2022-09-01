const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Products', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_api: {
      type: DataTypes.INTEGER,    
      
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },  
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },  
     
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,      
    },    
    metacriticRating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,      
    },    
    esrb_rating: {
       type: DataTypes.STRING,
       defaultValue: "Rating Pending"
    },
    background_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    released: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // trailer: {
    //   type: DataTypes.STRING,      
    // },
    requeriments_recomended: {
      type: DataTypes.STRING, 
      defaultValue: "Has no Requeriments"     
    },
    requeriments_min: {
      type: DataTypes.STRING,      
      defaultValue: "Has no Requeriments"     
    }, 
    price: {
      type: DataTypes.FLOAT,      
    }, 
    isDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,      
    },
    onSale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,      
    },
    // createdDb: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,      
    // },    
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