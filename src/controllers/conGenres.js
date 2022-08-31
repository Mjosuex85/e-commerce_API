const Router = require('Express')
const axios = require('axios')
const {Genre} = require("../db.js")
const router = Router()

//trae generos, ver si queremos que se ejecute al levantar el back en index.

router.get("/", async (req, res, next)=>{
    let generos = await Genre.findAll();
    if(generos.length){
        console.log("generos cargados de db")
        let find = await Genre.findAll();
        res.status(200).send(find);
    }else{
        console.log("generos cargados de la api")
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
            let check = await Genre.findAll()
            res.status(200).send(check)
            
        }catch(err){
            console.error(err)
            res.status(401).send(err)
        }
    }
})

module.exports = router;