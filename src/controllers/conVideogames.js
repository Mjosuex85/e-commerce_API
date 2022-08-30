const Router = require('Express')
const axios = require('axios')
const router = Router()
const {API_KEY} = process.env


router.get("/", async (req, res, next)=>{
    try{        
        console.log(process.env.API_KEY)
       const response =  await axios.get(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=10&page_size=100`)
       
        res.send(response.data.results)
    }catch(err){
        next(err)
    }
})
// router.get("/:id", (req, res, send)=>{
//     try{ 
//         let {id} = req.params.id
//         console.log(id)
//         axios(`https://api.rawg.io/api/games${env.API_KEY}`)
//         .then((all)=>res.send(all))
//     }catch(err){
//         next(err)
//     }

// })

module.exports = router;