const Router = require('Express')
const axios = require('axios')
const router = Router()


router.get("/", async (req, res, next)=>{
    console.log("HOLAAAAAAAAAAAAAAAAA")
    try{        
        const response = await axios.get(`https://api.rawg.io/api/genres?key=ea6bc50decb34451a163c6613b36672d`);
             
        res.send(response.data)
    }catch(err){
        console.log(err)
        next(err)
    }
})





module.exports = router;