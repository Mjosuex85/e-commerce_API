const Router = require('express');
const router = Router();
const { Products, Platforms, Genre, Screenshots, UsedPlatforms, UsedGenre } = require('../db');
const {Op} = require('sequelize');
const axios = require('axios');



router.get("/", async (req, res)=>{
    try{
        let nameQuery = req.query.name;
        if (nameQuery) {
            let slug = nameQuery.split(' ').join('-').toLowerCase();

            //pide resultados a la API 
            let fetchApiName= await axios.get(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${nameQuery}`);

            fetchApiName = fetchApiName.data.results

            const fetchDbName = await Products.findAll({
                //busca el nombre en la db
                where: {slug: {[Op.like]: '%' + slug + '%'}},
                include:[{model: Genre, attributes: ['name'], through: { attributes: [] }},
                        {model: Platforms, attributes: ['name'], through: { attributes: [] }}]
            });

            // let apiSinDb = [];
            fetchDbName.forEach((dbG)=>{
                fetchApiName = fetchApiName.filter(g => dbG.id_api !== g.id)
            })

            
            //dá formato y agega propiedad "notInStock" a los elementos traídos de la API, ya filtrados
            console.log(fetchApiName[0])
            fetchApiName = fetchApiName.map((p , i)=>{
                if (i < 2) {
                    console.log(p.genres);
                }
                return {   
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    rating: p.ratings[0]?.percent,
                    esrb_rating: p.esrb,
                    background_image: p.background_image,
                    released: p.released,
                    requeriments_recomended: "",
                    requeriments_min: "",
                    // price: Math.round(((Math.random() * 70)*100)/100),
                    slug: p.slug,
                    metacriticRating: p.metacritic,
                    // screenshots: short_screenshots&&short_screenshots,
                    // onSale: false,
                    fromApi: true,
                    platforms: p.platforms?.map(p=>{return{name: p.platform.name}}),
                    genres: p.genres?.map(g=>{return {name: g.name}})
            }})

            // console.log("fetchApiName---------------")

            let finalSearch = fetchDbName.concat(fetchApiName)
            
            // res.status(200).send("finalSearch-.---.-.-.");
            // res.status(200).send(fetchApiName);
            res.status(200).send(finalSearch);


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

router.get("/:id", async (req, res)=>{
    try{ 
        let {id} = req.params
        if (isNaN(id)) {
            var details = await Products.findOne({
                where: { id: id },
                include:[{model: Genre, attributes: ['name'], through: { attributes: [] }},
                        {model: Platforms, attributes: ['name'], through: { attributes: [] }},
                        {model: Screenshots, attributes: ['image'], through: { attributes: [] }}]
            });   
        }else{
            var details = await Products.findOne({
                where: { id_api: id },
                include:[{model: Genre, attributes: ['name'], through: { attributes: [] }},
                        {model: Platforms, attributes: ['name'], through: { attributes: [] }},
                        {model: Screenshots, attributes: ['image'], through: { attributes: [] }}]         
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

//el primer key/value del objeto req.body DEBE SER id:xxxxxxxxxxxx
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

//let product_required = name && description && genre && rating && metacriticRating && esrb_rating && background_image && released && requeriments_min && requeriments_recomended && price && onSale && isDisabled
router.post("/create", async (req,res)=>{
    const {name, genres, description, rating, metacriticRating, esrb_rating, 
        background_image, released, requeriments_min, requeriments_recomended,
        price, onSale, platforms, isDisabled, screenshots} = req.body;
        console.log("🚀 ~ file: conVideogames.js ~ line 168 ~ router.post ~ Screenshots", screenshots)
        
    if( name && description && genres && platforms && background_image &&
        released && price){
        try{
            let slug = name.split(' ').join('-').toLowerCase();
            let Create_Videogame = await Products.create({
                name, slug, description, rating, platforms, metacriticRating, esrb_rating,
                background_image, released, requeriments_min, requeriments_recomended,
                price, onSale, isDisabled
            });

            await screenshots.forEach(async (e) => {
                await Screenshots.create({                    
                    image: e
                });
            })

            await screenshots.forEach(async (e) => {
                var screenDb = await Screenshots.findAll({ where: { image: e }});
                await Create_Videogame.addScreenshots(screenDb);
            });

            const findGenre = await Genre.findAll({
                where:{name: genres}
            });
            const findPlatforms = await Platforms.findAll({
                where:{name: platforms}
            });
            Create_Videogame.addGenre(findGenre);
            Create_Videogame.addPlatforms(findPlatforms);


            platforms.map(async (e) => {
                let find = await UsedPlatforms.findOrCreate({
                    where: { name: e },
                });
            })
            
            genres.map(async (e) => {
                let find2 = await UsedGenre.findOrCreate({
                    where: { name: e },
                });
            })

            
            res.status(200).send("Videogame Succesfully Created!")
        }catch(e){
            console.error(e);
            res.status(401).send(e);
        };
    }else{
        res.status(401).send("Error. Complete the missing fields!.")
    };
});

router.get("/add_api/:id", async (req, res)=>{
    try{ 
        let {id} = req.params
        let product = await Products.findAll({ where: { id_api: id } });
        if(product.length === 0){
            let game = await axios.get(`https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`);
            game = game.data;
            let esrb = game.esrb_rating;
            if (esrb === null){
                esrb = "Not rated";
            } else { esrb = game.esrb_rating.name }

            let requirements = game.requirements_en;
            if (!requirements){
                requirements = {}
                requirements.recommended = 'No requirements';
                requirements.minimum = 'No requirements';
            }

            let screenshots_data = await axios.get(`https://api.rawg.io/api/games/${game.id}/screenshots?key=${process.env.API_KEY}`);
            let screenshots = screenshots_data.data.results;

            screenshots.forEach( async (e) => {
                await Screenshots.findOrCreate({
                    where:{  
                        id: e.id,
                        image: e.image
                    }
                });
            })
            
            let ratings
            if (!ratings) {
                game.ratings = Math.round(((Math.random() * ((87 - 1 + 1)+1))*100)/100)
            }else{
                ratings = game.ratings[0].percent
            }

            let  dbProduct = await Products.create({                               
                id_api: game.id,
                name: game.name,
                description: game.description_raw,
                rating: ratings,
                esrb_rating: esrb,
                background_image: game.background_image,
                released: game.released,
                requeriments_recomended: requirements.recommended,
                requeriments_min: requirements.minimum,
                price: Math.round(((Math.random() * ((70 - 1 + 1)+1))*100)/100),
                slug: game.slug,
                metacriticRating: game.metacritic,
                isDisabled: false,
            });

            screenshots.forEach(async (e) => {
                var screenDb = await Screenshots.findAll({ where: { id: e.id }});
                dbProduct.addScreenshots(screenDb);
            });
            

            game.genres.forEach(async (g) => {
                let find = await UsedGenre.findOrCreate({
                    where: { name: g.name },
                });
                var genreDb = await Genre.findAll({ where: { name:g.name } });
                await dbProduct.addGenre(genreDb);
            });
            
            game.platforms.forEach(async (p) => {
                let find = await UsedPlatforms.findOrCreate({
                    where: { name: p.platform.name },
                });
                var platformDb = await Platforms.findAll({ where: { name:p.platform.name } });
                await dbProduct.addPlatforms(platformDb);
            });

            res.status(200).send(dbProduct);
        }else{
            res.status(405).send('Game already in DB');
        }

    }catch(err){
        console.log(err);
        res.status(401).send(err);
    }
})



module.exports = router;