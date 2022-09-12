const Router = require('express');
const {Order} = require("../db.js");
const router = Router();


router.post("/post", async (req,res)=>{ //price --> mercado pago 
    const {user_id, game_id, game_name, username , price,   mercadopago_id }=req.body;
    if(user_id && game_id && game_name && username  && price &&  mercadopago_id ){
        try{
            let creation = await Order.create({
                mercadopago_id ,
                user_id,
                game_id,
                game_name,
                username,
                price,
            });
            res.status(200).send("creation")
        }catch(e){
            console.log(e)
            res.status(401).send(e)
        }
    }else{
        res.status(401).send("missing information")
    }
})

router.get("/all", async (req,res)=>{ //devuelve todos las compras 
    let findAll = await Order.findAll();
    if(findAll.length){
        try{
            res.status(200).send(findAll)
        }catch(e){
            res.status(401).send(e)
        }
    }else{
        res.status(401).send("nothing found in Order")
    }
})

router.get("/user/:id", async (req,res)=>{ //pasas ID de usuario y devuelve sus compras
    const {id}= req.params;
    let find = await Order.findAll({where:{user_id: id}})
    if(find){
        try{
            res.status(200).send(find);
        }catch(e){
            res.status(401).send(e);
        }
    }else{
        res.send("that user has no Buy Orders")
    };
});

router.get("/game/:id", async (req,res)=>{ //pasas id de un juego y te devuelve todos los usuarios que compraron ese juego
    const {id} = req.params;
    let find = await Order.findAll({where:{game_id: id}})
    if(find){
        try{
            res.status(200).send(find)
        }catch(e){
            console.log(e)
            res.status(401).send(e);
        };
    }else{
        res.send("that game has not been sold yet")
    };
});

module.exports = router;