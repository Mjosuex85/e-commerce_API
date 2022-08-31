const Router = require('Express')
const axios = require('axios')
const router = Router()



router.get("/", async (req, res, next)=>{
    try{
        const response =  await axios.get(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=10&page_size=100`)
        var videogames = response.data.results.map((game)=>{
            return {
                id: game.id,
                name: game.name,
                slug: game.slug,
                ratings: game.ratings,
                background_img: game.background_image,
                relesed: game.released,
                metacriticRating: game.metacritic,
                price: Math.round(((Math.random() * 70)*100)/100),
                esrb_rating: game.esrb_rating,
            }
        })
        if (req.query.name) {
            slug = req.query.name.split(' ').join('-').toLowerCase();
            console.log(slug);
            var game = videogames.filter(e => e.slug === slug);
            res.send(game)
        }else{
            res.send(videogames)
        }
    }catch(err){
        next(err)
    }
})

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