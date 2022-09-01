const Router = require('Express')
const axios = require('axios')
const router = Router()
const { Products, Platforms, Genre, Reviews } = require('../db')
const {Op} = require('sequelize')


const link_video = [`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page_size=40`,
`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=5&page_size=40`,
`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=11&page_size=40`];

// console.log(Product)
router.get("/", async (req, res, next)=>{
    try{
        let allProducts = await Products.findAll()
        if(allProducts.length === 0){
            // const response =  await axios.get(link_video) //
            let pedido = link_video.map((e)=>axios(e))
            let response = await Promise.all(pedido)
            response = response.map(e=>e.data.results)
            response= response[0].concat(response[1],response[2])

            await axios.get(`${process.env.URL}/genres`);
            await axios.get(`${process.env.URL}/platforms`);
            
            
            var videogames = await response.map(async (game, i)=>{
                
                let detail =  await axios.get(`https://api.rawg.io/api/games/${game.id}?key=${process.env.API_KEY}&page=10&page_size=100`);
                let genres = detail.data.genres.map((e) => e.name);
                let platforms = detail.data.platforms.map((e) => e.platform.name);

                let description = detail.data.description;
                
                let esrb = game.esrb_rating
                if (esrb === null){
                    esrb="Not rated"
                }else{
                    esrb = game.esrb_rating.name;
                }
                
                let requirements = game.requirements_en;
                if (!requirements){
                    requirements = {}
                    requirements.recommended = 'No requirements';
                    requirements.minimum = 'No requirements';
                }
                
                let  dbProduct = await Products.create({
                                       
                        id_api: game.id,
                        name: game.name,
                        description: description,
                        rating: game.ratings[0].percent,
                        esrb_rating: esrb,
                        background_image: game.background_image,
                        released: game.released,
                        requeriments_recomended: requirements.recommended,
                        requeriments_min: requirements.minimum,
                        price: Math.round(((Math.random() * 70)*100)/100),
                        slug: game.slug,
                        metacriticRating: game.metacritic,
                        isDisabled: false,
                        onSale: false,
                    })
                    
                    // let detail = arrDetail.filter((e) => e.id !== game.id);
                    //         console.log(detail.genres);
                            /*let foundGenre = genres.forEach(async (g) => {
                                    let gSearch = await Genre.findOne({
                                        where: {
                                        name: g,
                                        },
                                    });
                                    if(i < 1){
                                        console.log(dbProduct)
                                        console.log(gSearch)
                                    }
                                    let relationship = dbProduct.addGenre(gSearch);
                            });*/
                            genres.forEach(async (g) => {
                                var genreDb = await Genre.findAll({ where: { name:g } });
                                dbProduct.addGenre(genreDb);
                            });
                            let plat = await Platforms.findAll();
                        
                            platforms.forEach(async (p) => {
                                var platformDb = await Platforms.findAll({ where: { name:p } });
                                dbProduct.addPlatforms(platformDb);
                            });
                    return dbProduct.dataValues
                    })

                    //sin esto guarda igual en db
                    Promise.all(videogames)
                    .then((arr)=>{   
                        console.log('lo traje de la api')           
                        res.send(arr)
                    })
                    
        }else{
            console.log("lo traje de la Db")
            console.log(allProducts.length)
            res.send(allProducts)
        }        
    }catch(err){
        next(err)
    }
})

/*let totalData = await Videogame.findAll(
        {
          include: [{
            model: Genre,
            attributes: ["name"],
            through: {
              attributes: []
            }
          }]
        }
      )
      res.send(totalData);
    }*/

router.get("/:id", async (req, res, next)=>{
    try{ 
        let {id} = req.params
        const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`)
        console.log(response)
        var videogame = {
                id: response.data.id,
                name: response.data.name,
                slug: response.data.slug,
                description: response.data.description,
                ratings: response.data.ratings,
                background_img: response.data.background_image,
                relesed: response.data.released,
                metacriticRating: response.data.metacritic,
                price: Math.round(((Math.random() * 70)*100)/100),
                esrb_rating: response.data.esrb_rating,
                platform: response.data.platform,
        }
        res.send(videogame)
    }catch(err){
        next(err)
    }
})

module.exports = router;