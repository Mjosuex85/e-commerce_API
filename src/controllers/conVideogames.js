const Router = require('Express')

const router = Router()


router.get("/", (req, res, send)=>{
    try{
        axios(`https://api.rawg.io/api/games${env.API_KEY}`)
        .then((all)=>res.send(all))
    }catch(err){
        next(err)
    }

})

module.export = router;