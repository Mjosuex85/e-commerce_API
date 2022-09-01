const Router = require('express');
const router = Router();
const { Products, Platforms, Genre} = require('../db');
const {Op} = require('sequelize');


router.get("/", async (req, res, next)=>{
    try{
        let nameQuery = req.query.name;
        if (nameQuery) {
            let slug = nameQuery.split(' ').join('-').toLowerCase();
            const fetchDbName = await Products.findAll({
                //busca el nombre en la db
                where: {slug: {[Op.like]: '%' + slug + '%'}},
                include:[{model: Genre, attributes: ['name'], through: { attributes: [] }},
                        {model: Platforms, attributes: ['name'], through: { attributes: [] }}]
            });
            res.status(200).send(fetchDbName);
        }else{     
            var dbAll = await Products.findAll({
                include:[{model: Genre, attributes: ['name'], through: { attributes: [] }},
                        {model: Platforms, attributes: ['name'], through: { attributes: [] }}]
            });
            res.status(200).send(dbAll)
        }    
    }catch(err){
        console.log(err);
        res.status(401).send(err);
    }
})

router.get("/:id", async (req, res, next)=>{
    try{ 
        let {id} = req.params
        if (isNaN(id)) {
            var details = await Products.findOne({
                where: { id: id },
                include:[{model: Genre, attributes: ['name'], through: { attributes: [] }},
                        {model: Platforms, attributes: ['name'], through: { attributes: [] }}]         
            });   
        }else{
            var details = await Products.findOne({
                where: { id_api: id },
                include:[{model: Genre, attributes: ['name'], through: { attributes: [] }},
                        {model: Platforms, attributes: ['name'], through: { attributes: [] }}]         
            });
        }
        if (!details) {
            res.status(404).send(details);
        }else{
            res.status(200).send(details);
        }
    }catch(err){
        console.log(err);
        res.status(401).send(err);
    }
})


//let product_required = name && description && genre && rating && metacriticRating && esrb_rating && background_image && released && requeriments_min && requeriments_recomended && price && onSale && isDisabled
router.post("/create", async (req,res)=>{
    const {name, // no null
        genres, //
        description, //
        rating, //
        metacriticRating,
        esrb_rating, 
        background_image,
        released,
        requeriments_min,
        requeriments_recomended,
        price,
        onSale,
        platforms,
        isDisabled} = req.body;

    if( name && 
        description &&
        genres && 
        platforms &&
        background_image && //
        released && //
        price && 
        isDisabled){
        try{
            let slug = name.split(' ').join('-').toLowerCase();
            let Create_Videogame = await Products.create({
                name,
                slug,
                description,
                rating,
                platforms,
                metacriticRating,
                esrb_rating,
                background_image,
                released,
                requeriments_min,
                requeriments_recomended,
                price,
                onSale,
                isDisabled
            });
            const findGenre = await Genre.findAll({
                where:{name: genres}
            });
            const findPlatforms = await Platforms.findAll({
                where:{name: platforms}
            });
            Create_Videogame.addGenre(findGenre);
            Create_Videogame.addPlatforms(findPlatforms);
            res.status(200).send("Videogame Succesfully Created!")
        }catch(e){
            console.error(e);
            res.status(401).send(e);
        };
    }else{
        res.status(401).send("Error. Complete the missing fields!.")
    };
});

module.exports = router;