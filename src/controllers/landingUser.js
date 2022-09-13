const { Router } = require('express');

const passport = require('passport')

const { Users, AuthUsers, Products } = require('../db');
const router = Router();
const { confirmacionCompra } = require("./helpers/sendEmail")

function isAuthenticated(req, res, next) {
    console.log(req.user)
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = id.length > 3 ? await AuthUsers.findOne({ where: { id }, include: Products }) : await Users.findOne({ where: { id }, include: 'Products' }),
        products = await user.getProducts({
            attributes: ['id', 'name', 'price'],
            raw: true
        });

        res.json({
            message: 'Welcome ' + user.username,
            user,
            products: products
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/putorder/:id', async (req, res)=>{
    try {
        const {id} = req.params;
        const {idProduct} = req.query;
        const user = id.length > 3 ? await AuthUsers.findOne({ where: { id }, include: Products }) : await Users.findOne({ where: { id }, include: 'Products' });
        if( id.length > 3){
            await user.addProducts(idProduct, { through: 'Order' });
        } else{
            await user.addProducts(idProduct, { through: 'order' });
        }
        await user.removeProducts(idProduct)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

router.get('/deleteFavorite/:idProduct', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { id } = req.user,
        { idProduct } = req.params,
        user = id.length > 3 ? await AuthUsers.findByPk(id) : await Users.findByPk(id);

        await user.removeProducts(idProduct)
        res.send(true);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

router.get('/addFavorite/:idProduct', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { id } = req.user,
        { idProduct } = req.params,
        user = id.length > 3 ? await AuthUsers.findByPk(id) : await Users.findByPk(id);
        if( id.length > 3){
            await user.addProducts(idProduct, { through: 'Favorites' });
        } else{
            await user.addProducts(idProduct, { through: 'whishList' });
        }
        res.send(true);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

router.get('/buy/:idProduct', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.user;
        const { idProduct } = req.params;
        const user = id.length > 3 ? await AuthUsers.findByPk(id) : await Users.findByPk(id);
        user.addProducts(idProduct, { through: 'Order' });
        confirmacionCompra(user.email)
        res.send('Buy succesfully');
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/verify', async (req, res) => {
    try {
        const { email } = req.query
        const user = await Users.findOne({ where: { email } });
        if (user === null) {
            res.json({ message: 'Not Found' })
        } else if (user.isVerified) {
            res.send(false)
        } else if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
            res.send(true)
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/find/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        let user = {
            isVerified: false,
            isBanned: false,
        }
        const response = await Users.findOne({ where: { email } });
        if (!response) {
            res.json({ user: null });
            return;
        }
        if (response.isVerified) {
            user = { ...user, isVerified: true };
        }
        if (response.isBanned) {
            user = { ...user, isBanned: true };
        }
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/find/username/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const response = await Users.findOne({ where: { username } });
        if (response) {
            res.json({ 'user': true })
        } else {
            res.json({ 'user': false })
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});
module.exports = router;
