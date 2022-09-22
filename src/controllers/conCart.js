const Router = require('express');
const {Products,Users, Order, AuthUsers} = require("../db.js");
const router = Router();
const {createPdf} = require('./helpers/createPdf');
const { buyConfirm } = require('./helpers/sendEmail.js');
var bigInt = require("big-integer");

router.get('/feedback',async function(req, res) {
    try{
        let mp_response = req.query
        let id_user=[]
        console.log(mp_response)
        id_user = mp_response.external_reference?.split("/").shift()
        id_user = id_user.slice(1, -1);
        console.log("aca viene el id user")
        console.log(id_user)
        console.log("aca viene el bigint")
        //id_user = BigInt(id_user) //102966775138757338073
        //id_user=id_user.slice(0,-1)
        //id_user = parseInt(id_user)
        let array_games_id = mp_response.external_reference.split("/").pop()
        array_games_id = array_games_id.split("*")
        if(id_user.length > 10){
            console.log("es de google")
            let user_db = await AuthUsers.findOne({where:{id:id_user}})
            await array_games_id.map(async e=>{
                try{
                    let game_db = await Products.findOne({where:{id:e}});
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
            })
            res.writeHead(302, {
                Location: `${process.env.URL_ALLOWED}/success`
            });
            res.end();
            

        }else{
            console.log("es local")
            try{
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
    }
}catch(e){
    console.log(e)
}
});


/* http://localhost:3001/cart/feedback?mp_response=collection_id:'26011077746'&collection_status:'approved'&payment_id:'26011077746'&status:'approved'&external_reference:'"102966775138757338073"/1b6a4be1-3721-4902-ae2c-b9e7481b0084*1b6a4be1-3721-4902-ae2c-b9e7481b0085'&payment_type:'credit_card'&merchant_order_id:'5903770201'&preference_id:'98201383-6ecb793e-2604-4b70-99bd-113f4527d69b'&site_id:'MLA'&processing_mode:'aggregator'&merchant_account_id:'null'

http://localhost:3001/cart/feedback?mp_response=payment_id:'26011077746'&external_reference:'"102966775138757338073"/1b6a4be1-3721-4902-ae2c-b9e7481b0084*1b6a4be1-3721-4902-ae2c-b9e7481b0085'
 */
/*{
    collection_id: '26011077746',
    collection_status: 'approved',
    payment_id: '26011077746', //
    status: 'approved',
    external_reference: '"102966775138757338073"/1b6a4be1-3721-4902-ae2c-b9e7481b0084', //
    payment_type: 'credit_card',
    merchant_order_id: '5903770201',
    preference_id: '98201383-6ecb793e-2604-4b70-99bd-113f4527d69b',
    site_id: 'MLA',
    processing_mode: 'aggregator',
    merchant_account_id: 'null'
  }*/



///cart/feedback?collection_id=26011022324&collection_status=approved&payment_id=26011022324&status=approved&external_reference=%22102966775138757338073%22/0da3877c-3a02-4f5f-b0c3-bcf2a48c6cb8&payment_type=account_money&merchant_order_id=5903756527&preference_id=98201383-bdf7d616-7e51-441d-9634-af09c6ad1009&site_id=MLA&processing_mode=aggregator&merchant_account_id=null

















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