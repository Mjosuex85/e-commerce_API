const { Router } = require('express');
const {Users} = require("../db");
const router = Router();

//---- edit user

router.get("/", async(req,res)=>{  //si es por params no puedo hacer que retorne todo.
    const {id} = req.query;
    //console.log(id)
    try{
        let data;
        if(id){
            data = await Users.findOne( {where: {id : id}});
        }else{
            console.log("entre al else")
            data=await Users.findAll();
        };
        res.status(200).send(data);
    }catch(e){
        console.error(e)
        res.status(401).send("error al cargar los usuarios");
    };
});

//screenshots -- products

module.exports = router;