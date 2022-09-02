const { Router } = require('express');
const {Users} = require("../db");
const router = Router();

//---- edit user

router.get("/all", async (req,res)=>{ //anda
    let data = await Users.findAll();
    if(data.length){
        res.status(200).send(data)
    }else{
        res.status(401).send("No users found");
    };
})

router.get("/:id", async(req,res)=>{   //anda, si no se le pasa id se rompe
    const {id} = req.params;
    //console.log(id)
        try{
            let data;
            if(id){
                data = await Users.findOne( {where: {id : id}});
                if(!data) return res.send("user not found")
            }
            res.status(200).send(data);
        }catch(e){
            console.error(e)
            res.status(401).send("error al cargar los usuarios");
        };
});

router.put("/ban/:id", async (req,res)=>{ //se rompe si no pasa id,
    const {id} = req.params;
    console.log(id)
        try{
            let user = await Users.findOne({where: {id: id}});
            if (!user) return res.status(401).send("User not found")
            if(user.isBanned === false){
                user.isBanned = true
            }/* else{
                user.isBanned = false;
            }; */
            await user.save();
            res.status(200).send(user);
        }catch(e){
            console.error(e);
            res.status(401).send(e);
        };
});


router.put("/unban/:id", async (req,res)=>{ //se rompe si no pasa id
    const {id} = req.params;
    let user = await Users.findOne({where: {id: id}});
    if (!user) return res.status(401).send("User not found");
    try{
        if(user.isBanned === true){
            user.isBanned = false;
            console.log("user unbanned!")
        }
        await user.save();
        res.status(200).send(user);
    }catch(e){
        console.error(e);
        res.status(401).send(e);
    };
});

//screenshots -- products

module.exports = router;