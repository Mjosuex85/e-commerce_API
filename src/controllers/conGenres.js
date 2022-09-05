const Router = require('express');
const {Genre,UsedGenre} = require("../db.js");
const router = Router();

//trae generos, ver si queremos que se ejecute al levantar el back en index.

router.get("/", async (_, res)=>{
    try{
        let generos = await Genre.findAll();
        res.status(200).send(generos);
    }catch(err){
        console.error(err);
        res.status(401).send(err);
    }
});

router.get("/used", async (_, res)=>{
    try{
        let generos = await UsedGenre.findAll();
        res.status(200).send(generos);
    }catch(err){
        console.error(err);
        res.status(401).send(err);
    }
});


module.exports = router;