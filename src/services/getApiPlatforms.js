const axios = require('axios');

async function getApiPlatforms(Platforms) {
    try{
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
        platformsApi.forEach( async (e) => {
            await Platforms.create({name: e.name, image_background: e.image_background});
        });
        console.log('Platforms loaded')
    }catch(err){
        console.log(err);
    }
}

module.exports = getApiPlatforms;