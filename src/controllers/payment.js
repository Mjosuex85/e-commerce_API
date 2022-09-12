const { Router } = require('express');
const router = Router();
const mercadopago = require("mercadopago");
const { ACCESS_TOKEN } = process.env;

// Agrega credenciales
mercadopago.configure({
  access_token: ACCESS_TOKEN,
});

// let preference = {
//     items: [
//       {
//         title: "Mi producto",
//         unit_price: 100,
//         quantity: 1,
//       },
//     ]
//   };
  
  
  
  router.post('/', function(req, res, next) {
    /* aquí crea tu orden en la DB para el usuario logeado */
  //const order = db.orders.create({ userId: req.userId, productId: req.body.productId }); // <--- pseudo-código
    let preference = req.body;

    mercadopago.preferences
    .create(preference)
    .then(function (response) {
        console.log(response)
    // En esta instancia deberás asignar el valor dentro de response.body.id por el ID de preferencia solicitado en el siguiente paso
    res.json({ preferenceId: response.body.id })
    })
    .catch(function (error) {
    console.log(error);
    });
  });

module.exports = router;