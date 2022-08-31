const Router = require('Express')
const axios = require('axios')
const router = Router()



router.get("/", async (req, res, next)=>{
    try{        
        console.log(process.env.API_KEY)
       const response =  await axios.get(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=10&page_size=100`)       
        res.send(response.data.results)
    }catch(err){
        next(err)
    }
})

router.get("/:id", async (req, res, next)=>{
    try{ 
        let {id} = req.params
        const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`)
        console.log(response.data)
        res.send(response.data)
    }catch(err){
        next(err)
    }
})

module.exports = router;