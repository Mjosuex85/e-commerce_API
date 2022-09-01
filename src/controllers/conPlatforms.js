const Router = require('Express');
const axios = require('axios');
const router = Router();
const {Platforms} = require('../db');

router.get("/", async (req, res, next)=>{
    try{
        let plat = await Platforms.findAll();
        if (plat.length === 0) {
            const response = await axios.get(`https://api.rawg.io/api/platforms/lists/parents?key=${process.env.API_KEY}`);
            var platformsApi = response.data.results.map( e => {
                return e.platforms.map(e => {
                    return {
                        name: e.name,
                        image_background: e.image_background,
                    }
                });
            });
            platformsApi = [].concat.apply([], platformsApi);
            platformsApi.forEach(e => {
                Platforms.create({name: e.name, image_background: e.image_background});
            });
        }
        const allPlatforms = await Platforms.findAll();
        res.status(200).send(allPlatforms);
    }catch(err){
        console.log(err);
        res.status(401).send(err);
    }
})

module.exports = router;