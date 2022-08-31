const Router = require('Express')
const axios = require('axios')
const router = Router()


router.get("/", async (req, res, next)=>{
    console.log("HOLAAAAAAAAAAAAAAAAA")
    try{        
        const response = await axios.get(`https://api.rawg.io/api/platforms/lists/parents?key=34071ca514064be9b4e513a0c8ab844a`);
             
        res.send(response.data)
    }catch(err){
        console.log(err)
        next(err)
    }
})





module.exports = router;