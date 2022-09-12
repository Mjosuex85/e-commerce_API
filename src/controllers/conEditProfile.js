const { Router } = require('express');
const router = Router();
const { AuthUsers, Users } = require('../db');
const {Op} = require('sequelize');
const axios = require('axios');




router.put('/', async(req, res, next)=>{
    try {      
        let edit = req.body
        let id= req.body.id

        if(id.length <= 5){
            let keys = Object.keys(edit)
            keys.shift()

            let values = Object.values(edit)
            values.shift() 
        
            keys.map(async(k, i)=>{await Users.update({
                [k]: values[i],
            }, {
                where: {
                    id: [id],
            }})
        });}
        else{
            let keys = Object.keys(edit)
        keys.shift()

        let values = Object.values(edit)
        values.shift() 
        
        keys.map(async(k, i)=>{await AuthUsers.update({
            [k]: values[i],
        }, {
            where: {
                id: [id],
            }})
        });

        }
        
        
        
       res.status(200).send("Usuario editado!")
    } catch (err) {
        next(err)
    }
}) 

module.exports = router;