const axios = require('axios');

async function getApiGenres(Genre) {
    try{        
        const response = await axios.get(`https://api.rawg.io/api/genres?key=${process.env.API_KEY}`);
        let GenresApi = response.data.results.map(e=>e.name)
        GenresApi.forEach(async (e) => 
            await Genre.findOrCreate({
                where:{
                    name:e
                }
            })
        );
        console.log('Genres loaded')
    }catch(err){
        console.error(err)
    }
}

module.exports = getApiGenres;