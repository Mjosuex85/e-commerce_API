const axios = require('axios');

async function getApiGames(Products, Platforms, Genre, Screenshots, UsedGenre, UsedPlatforms) {
    try{
        const link_video = [`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page_size=40`,
        `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=5&page_size=40`,
        `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=11&page_size=40`];
        
        // const response =  await axios.get(link_video)

        let pedido = link_video.map((e)=>axios(e));
        let response = await Promise.all(pedido).catch((err)=>console.log(err));
        response = response.map(e=>e.data.results);
        response = response[0].concat(response[1],response[2]);

        var randomSale = [1,3,5,7,9]
        var saleAmount = 9

        await response.forEach(async (game)=>{
            
            let detail =  await axios.get(`https://api.rawg.io/api/games/${game.id}?key=${process.env.API_KEY}&page=10&page_size=100`);
            let genres = detail.data.genres.map((e) => e.name);
            let platforms = detail.data.platforms.map((e) => e.platform.name);

            let screenshots_data = await axios.get(`https://api.rawg.io/api/games/${game.id}/screenshots?key=${process.env.API_KEY}`);
            let screenshots = screenshots_data.data.results;

            screenshots.forEach((e) => {
                Screenshots.create({
                    id: e.id,
                    image: e.image
                });
            })

            let description = detail.data.description_raw;
            
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

            let onSale = false;

            if (saleAmount !== 0) {
                if(randomSale.includes(Math.trunc(Math.random() * 11))){
                    onSale = true;
                    saleAmount -= 1;
                }

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
                price: Math.round(((Math.random() * ((70 - 1 + 1)+1))*100)/100),
                slug: game.slug,
                metacriticRating: game.metacritic,
                isDisabled: false,
                onSale: onSale,
            })
            
            screenshots.forEach(async (e) => {
                var screenDb = await Screenshots.findAll({ where: { id: e.id }});
                dbProduct.addScreenshots(screenDb);
            });

            genres.forEach(async (g) => {
                let find = await UsedGenre.findOrCreate({
                    where: { name: g },
                  });
                var genreDb = await Genre.findAll({ where: { name:g } });
                dbProduct.addGenre(genreDb);
            });
            
            platforms.forEach(async (p) => {
                let find = await UsedPlatforms.findOrCreate({
                    where: { name: p },
                  });
                var platformDb = await Platforms.findAll({ where: { name:p } });
                dbProduct.addPlatforms(platformDb);
            });
        });
    }catch(err){
        console.log('error de getApiGames');
        console.log(err);
    }
}

module.exports = getApiGames;