const { Router } = require('express');

const { Users } = require('../db');
const router = Router();

function isAuthenticaded(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}

router.get('/', isAuthenticaded, async(req, res)=>{
    try {      
        const {id} = req.user.dataValues;
        const userAuth = await Users.findOne({ where: {id}, include:'Products'});
        res.json({message: 'Welcome '+ userAuth.name, user: userAuth});
    } catch (error) {
        res.status(404).json({error: error.message});
    }
})

router.get('/auth', async(req, res)=>{
    try {      
        res.json({user: req.user});
    } catch (error) {
        res.status(404).json({error: error.message});
    }
})

router.get('/addFavorite/:idProduct', isAuthenticaded, async(req, res)=>{
    try {
        const {id} = req.user.dataValues;
        const { idProduct }= req.params;
        const userAuth = await Users.findByPk(id);
        userAuth.addProducts(idProduct, {through: 'Favorites'});
        res.send('Added to Favorites');
    } catch (error) {
        res.status(404).json({error: error.message});
    }
})

router.get('/buy/:idProduct', isAuthenticaded, async(req, res)=>{
    try {
        const {id} = req.user.dataValues;
        const { idProduct }= req.query;
        const userAuth = await Users.findByPk(id);
        userAuth.addProducts(idProduct, {through: 'Order'});
        res.send('Buy succesfully');
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});

router.get('/find/email/:email', async(req, res)=>{
    try {
        const {email} = req.params;
        const response = await Users.findOne({ where: { email } });
        if(response){
            res.json({'user': true})
        }else{
            res.json({'user': false})
        }
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});

router.get('/find/username/:username', async(req, res)=>{
    try {
        const {username} = req.params;
        const response = await Users.findOne({where:{username}});
        if(response){
            res.json({'user': true})
        }else{
            res.json({'user': false})
        }
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});
module.exports = router;
