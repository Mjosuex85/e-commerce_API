const { Router } = require('express');

const { Users, AuthUsers } = require('../db');
const router = Router();

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}

router.get('/', isAuthenticated, async(req, res)=>{
    try {
        const {id} = req.user.dataValues;
        let user = await Users.findOne({ where: {id}, include:'Products'});
        console.log(user)
        res.json({message: 'Welcome '+ user.username, user: user});
    } catch (error) {
        res.status(404).json({error: error.message});
    }
})

router.get('/addFavorite/:idProduct', isAuthenticated, async(req, res)=>{
    try {
        const {id} = req.user.dataValues;
        const { idProduct }= req.params;
        const user = typeof id === 'string'? await AuthUsers.findByPk(id) : await Users.findByPk(id);
        user.addProducts(idProduct, {through: 'Favorites'});
        res.send('Added to Favorites');
    } catch (error) {
        res.status(404).json({error: error.message});
    }
})

router.get('/buy/:idProduct', isAuthenticated, async(req, res)=>{
    try {
        const {id} = req.user.dataValues;
        const { idProduct }= req.params;
        const user = typeof id === 'string'? await AuthUsers.findByPk(id) : await Users.findByPk(id);
        user.addProducts(idProduct, {through: 'Order'});
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
        console.log(error)
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
