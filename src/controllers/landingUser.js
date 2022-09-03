const { Router } = require('express');
const { Users } = require('../db');

const router = Router();

function isAuthenticaded(req, res, next){
    if(req.isAuthenticated) return next();
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

router.get('/addFavorite', isAuthenticaded, async(req, res)=>{
    try {
        const {id} = req.user.dataValues;
        const { productId }= req.query;
        const userAuth = await Users.findByPk(id);
        userAuth.addProducts(productId, {through: 'Favorites'});
        res.send('Added to Favorites');
    } catch (error) {
        res.status(404).json({error: error.message});
    }
})

router.get('/buy', isAuthenticaded, async(req, res)=>{
    try {
        const {id} = req.user.dataValues;
        const { productId }= req.query;
        const userAuth = await Users.findByPk(id);
        userAuth.addProducts(productId, {through: 'Order'});
        res.send('Buy succesfully');
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});

router.get('/find/:email', async(req, res)=>{
    try {
        const {email} = req.params;
        const useEmail = await Users.findOne({where:{email}});
        res.json({'user': useEmail});
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});

router.get('/find/:username', async(req, res)=>{
    try {
        const {username} = req.params;
        const useEmail = await Users.findOne({where:{username}});
        res.json({'user': useEmail});
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});
module.exports = router;