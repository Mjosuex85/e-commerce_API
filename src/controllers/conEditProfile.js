const { Router } = require('express');
const router = Router();
const { Products, Platforms, Genre, Screenshots, UsedPlatforms, UsedGenre } = require('../db');
const {Op} = require('sequelize');
const axios = require('axios');




router.put('/edit', async(req, res, next)=>{
    try {      
        let edit = req.body
        let id= req.body.id

        let keys = Object.keys(edit)
        keys.shift()

        let values = Object.values(edit)
        values.shift() 
        
        keys.map(async(k, i)=>{await Products.update({
            [k]: values[i],
        }, {
            where: {
                id: [id],
            }})
        });
        
        let product = await Products.findOne({ where: { id: id } });

        if (edit.addGenre) {
            edit.addGenre.forEach(async (e) => {
                let genre = await Genre.findOne({ where: { name:  e} });
                await product.addGenre(genre)
            });
        }
        if (edit.rmvGenre) {
            edit.rmvGenre.forEach(async (e) => {
                let genre = await Genre.findOne({ where: { name:  e} });
                await product.removeGenre(genre)
            });
        }
        if (edit.addPlat) {
            edit.addPlat.forEach(async (e) => {
                let plat = await Platforms.findOne({ where: { name:  e} });
                await product.addPlatforms(plat)
            });
        }
        if (edit.rmvPlat) {
            edit.rmvPlat.forEach(async (e) => {
                let plat = await Platforms.findOne({ where: { name:  e} });
                await product.removePlatforms(plat)
            });
        }
        
        
       res.status(200).send("Juego editado!")
    } catch (err) {
        next(err)
    }
}) 