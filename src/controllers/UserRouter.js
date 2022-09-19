const { Router } = require('express');
const {Users, AuthUsers} = require("../db");
const router = Router();

//---- edit user

router.get("/all", async (req,res)=>{ //anda
    let data = await Users.findAll();
    let google = await AuthUsers.findAll();
    let allUsers = data.concat(google)
    if(data.length || google.length){
        res.status(200).send(allUsers)
    }else{
        res.status(401).send("No users found");
    };
})

router.get("/:id", async(req,res)=>{   //anda, si no se le pasa id se rompe
    let {id} = req.params;
    //console.log(id)
        try{
            let data;
            let google;
            if(id){
                if(id.length > 8){
                    google = await AuthUsers.findOne({where:{id:id}})
                    if(!google) return res.send("user not found")
                }
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
    let {id} = req.params;
    console.log(id)
    let user;
        try{
            if(id.length > 8){
                user=await AuthUsers.findOne({where:{id:id}})
                if(!user) return res.status(401).send("user not found")
                if(user.isBanned === false){
                    user.isBanned = true
                }
                await user.save();
                res.status(200).send(user);
                return
            }
            user = await Users.findOne({where: {id: id}});
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
    let {id} = req.params;
    let user;
    try{
        if(id.length > 8){
            user = await AuthUsers.findOne({where: {id: id}});
            if(!user) return res.status(401).send("user not found")
            if(user.isBanned === true){
                user.isBanned = false;
                console.log("user unbanned!")
            }
            await user.save();
            res.status(200).send(user);
            return
        }
        user = await Users.findOne({where: {id: id}});
        if (!user) return res.status(401).send("User not found");
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

router.put("/admin/:user_id", async (req,res)=>{
    let {user_id} = req.params;
    console.log(user_id)
    console.log(typeof user_id) //string
    let user;
    try{
        if(user_id.length > 8 ){
            user = await AuthUsers.findOne({where: {id: user_id}});
            console.log(user) //null
            if(!user) return res.status(401).send("no encontre el usuario google");
            if(user.isAdmin === false){
                user.isAdmin = true;
                console.log("User is now an Admin.");
            }else{
                user.isAdmin = false;
                console.log("User is now a normal user.")
            }
            await user.save();
            res.status(200).send(user)
            return
        }
        user = await Users.findOne({where:{id: user_id}});
        if(!user) return res.status(401).send("User not found");
        if(user.isAdmin === false){
            user.isAdmin = true;
            console.log("User is now an Admin.");
        }else{
            user.isAdmin = false;
            console.log("User is now a normal user.")
        }
        await user.save();
        res.status(200).send(user)
    }catch(error){
        console.log(error);
        res.status(401).send(error);
    };
});

//screenshots -- products

module.exports = router;