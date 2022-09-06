const { Router } = require('express');
const router = Router();
const mercadopago = require("mercadopago");
const { ACCESS_TOKEN } = process.env;

// Agrega credenciales
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

let preference = {
    items: [
      {
        title: "Mi producto",
        unit_price: 100,
        quantity: 1,
      },
    ],
  };
  
  
  
  router.post('/', function(req, res, next) {
    /* aquí crea tu orden en la DB para el usuario logeado */
  //const order = db.orders.create({ userId: req.userId, productId: req.body.productId }); // <--- pseudo-código


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

// const mercadopago = require ('mercadopago');
// const express = require('express');
// const port = 3000;

// mercadopago.configure({
//   access_token: 'PROD_ACCESS_TOKEN'
// });

// app.post('/api/orders', (req, res) => {
//   /* aquí crea tu orden en la DB para el usuario logeado */
//   const order = db.orders.create({ userId: req.userId, productId: req.body.productId }); // <--- pseudo-código

//   // Ahora le decimos a MP que cree la "preferencia". Asume que "order" tiene datos del producto
//   mercadopago.preferences.create({
//     items: [
//       {
//         title: order.product.name,
//         unit_price: order.price,
//         quantity: order.quantity,
//       }
//     ]
//   }).then((preference) => {
//     // el front recibirá el preferenceId :)
//     res.json({ preferenceId: preference.id });
//   });
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })