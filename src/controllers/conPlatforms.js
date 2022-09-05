const Router = require('express');
const router = Router();
const {Platforms,UsedPlatforms} = require('../db');

router.get("/", async (_, res)=>{
    try{
        const allPlatforms = await Platforms.findAll();
        res.status(200).send(allPlatforms);
    }catch(err){
        console.log(err);
        res.status(401).send(err);
    }
})

router.get("/used", async (_, res)=>{
    try{
        const allPlatforms = await UsedPlatforms.findAll();
        res.status(200).send(allPlatforms);
    }catch(err){
        console.log(err);
        res.status(401).send(err);
    }
})

module.exports = router;