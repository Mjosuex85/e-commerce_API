const axios = require('axios');

async function getApiGenres(Genre) {
    try{        
        const response = await axios.get(`https://api.rawg.io/api/genres?key=ea6bc50decb34451a163c6613b36672d`);
        let GenresApi = response.data.results.map(e=>e.name)
        GenresApi.forEach(e => 
            Genre.findOrCreate({
                where:{
                    name:e
                }
            })
        );
    }catch(err){
        console.error(err)
    }
}

module.exports = getApiGenres;