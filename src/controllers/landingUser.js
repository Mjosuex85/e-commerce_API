// Access for all the user info

const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken')

function isAuthenticaded(req, res, next){
    if(req.isAuthenticaded) return next()
    res.redirect('/login')
}

router.get('/', isAuthenticaded, (req, res)=>{
    // User Orders
    // User Favorites
    // create JWT
    res.send('Your enter')
})
module.exports = router;