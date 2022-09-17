const Router = require('express');
const {Products,Users, Order} = require("../db.js");
const router = Router();
const {createPdf} = require('./helpers/createPdf');
const { buyConfirm } = require('./helpers/sendEmail.js');

router.get('/feedback',async function(req, res) {
    try{
        let mp_response = req.query
        let id_user=[]
        id_user = mp_response.external_reference?.split("/").shift()
        let array_games_id = mp_response.external_reference.split("/").pop()
        array_games_id = array_games_id.split("*")
        let user_db = await Users.findOne({where:{id:id_user}})
        await array_games_id.map (async e=>{
            try{
                console.log(e)
            let game_db = await Products.findOne({where:{id: e}});
            await Order.create({
                user_id:id_user,
                game_id:e,
                game_name: game_db.name,
                username:user_db.username,
                mercadopago_id:mp_response.payment_id,
                price:game_db.price
            })
            const pdf = await createPdf(user_db, game_db);
            await buyConfirm(user_db.email, pdf);
            }catch(e){
                console.log(e)
            }
        });
        res.writeHead(302, {
            Location: `${process.env.URL_ALLOWED}/success`
        });
        res.end();
    }catch(e){
        console.log(e)
        res.send(e)
    }
});

router.get('/notify',async function(req, res, next){
    try {
        const user = await Users.findOne({where:{id:3}}),
        product = await Products.findOne({where:{id:'e31b3ef1-0723-4a92-9516-ad7473f65dad'}}),
        pdf = await createPdf(user, product);
    
        await buyConfirm(user.email, pdf);
        res.send('ok')
    } catch (error) {
        res-send(error.message)
    }
  })
























/* const mercadopago = require("mercadopago");
const {ACCESS_TOKEN} = process.env;

mercadopago.configure({
    access_token: ACCESS_TOKEN
});

//agrega credenciales
mercadopago.configure({
    access_token: ACCESS_TOKEN
});

router.post('/', (req, res) => {
    
//cosas que deberia recibir por body
    
    const carrito = req.body
    const id_orden = carrito.map(e => e.id).join('-')
    
//cosas que requiere MP de tu respectiva compra
    const items_mp = carrito.map(e => ({
        id: e.id,
        title: e.name,
        unit_price: e.price,
        quantity: 1
    }));

//objeto de preferencia
let preference = {
    items: items_mp, //el carrito solo con los datos importantes
    external_reference: `${id_orden}`, //el id de cada orden
    payment_methods: {
        excluded_payment_types:[
            {
                id: 'atm' //excluir el metodo de pago
            }
        ],
        installments: 3 //cuotas
    },
    "back_urls": {
        "success": "http://localhost:3001/mercadopago/save_data",
        "failure": "http://localhost:3000/home",
        "pending": "http://localhost:3000/home"
    },
};

mercadopago.preferences.create(preference)

.then(function(response){
    console.info('respondio')
    global.init_point = response.body.init_point
    global.id = response.body.id;
    console.log(response.body)
    // console.log(response.body)
    res.json({ id: global.id, init_point: global.init_point })//lo que devolvemos al front
})
.catch(function(error){
    console.log(error)
});
});

router.get('/save_data', async(req, res) => {
    //console.log('Llegue hasta aca')
    //console.info('lo que me devuelve MP', req.session.passport.user)
    //console.log('hola')
    const id_user = req.session.passport.user
    const payment_id= req.query.payment_id
    const payment_status= req.query.status
    const external_reference = req.query.external_reference.split('-')
    const merchant_order_id= req.query.merchant_order_id
    
    console.log("EXTERNAL REFERENCE ",external_reference)
    const videogames = await Product.findAll({where:{"id":external_reference}})
    const user = await Users.findByPk(id_user)

    //Agrega a libreria los juegos
    

    let objeto = videogames.map(e => ({
        'id_sale':payment_id,
        'id_game':e.dataValues.id,
        'id_user':id_user,
        'price': e.dataValues.price
    }))
    
    const promise_pending_array = objeto.map(e => Order.create(e))

    await Promise.all(promise_pending_array)
    
    let game_stock
    
    //Aumentar stock
    for(let i = 0; i<external_reference.length; i++){
        game_stock = await Product.findByPk(external_reference[i])
        game_stock.contador = game_stock.contador + 1
        await game_stock.save()
    }
    /////////////////
    
    let longitude = external_reference.length
    let secret_code = await randomstring.generate(7);
    let resultado = await user.addLibrary(videogames)


    for(let i = 0; i < resultado.length; i++){
        resultado[i].code = secret_code
        await resultado[i].save()
    }
    //Vaciar carrito despues de la compra
    if(payment_status === 'approved') {
        const promise_delete_array = videogames.map(e => user.removeCart(e))
        await Promise.all(promise_delete_array)
    }
    //Actualizar codigo
    //Enviar mail
    


    res.redirect(`http://localhost:3001/authentication/email/gameActivation/${secret_code}/${id_user}/${longitude}`)
}) */



module.exports = router;