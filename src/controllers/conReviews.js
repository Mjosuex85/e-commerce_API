const Router = require('express');
const router = Router();
const { Reviews, Products, Users } = require('../db.js');



router.post('/', async (req, res )=>{
    try {
        const {rating, description, username, productId} = req.body;

        let user = await Users.findOne({where: {username: username}});
        let product = await Products.findOne({where: {id: productId}});
        if (!user){
            res.status(400).send('User does not exist');
        }else if (!product){
            res.status(400).send('Product does not exist');
        }else if (!description || !rating) {
            res.status(400).send('All parameters are required');
        }else{
            let review = await Reviews.create({
                rating: rating,
                description: description,
                username: username,
                productId: productId
            });
    
            res.status(200).send('Review added');
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.get('/:productId', async (req, res )=>{
    try {
        let {productId} = req.params;
        let product = await Products.findOne({where: {id: productId}});
        if (!product){
            res.status(400).send('Product does not exist');
        }else{
            let reviews = await Reviews.findAll({ where: { productId: productId }});
            res.status(200).send(reviews);
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.get('/', async (req, res )=>{
    try {
        let username = req.query.username;
        if (username) {
            let user = await Users.findOne({where: {username: username}});
            if (!user){
                res.status(400).send('User does not exist');
            }else{
                let reviews = await Reviews.findAll({ where: { username: username }});
                res.status(200).send(reviews);
            }
        }else{
            let allReviews = await Reviews.findAll();
            res.status(200).send(allReviews)
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
})


router.put("/remove/:id", async (req,res)=>{
    console.log(req.params)
    const {id} = req.params;
        try{
            let review = await Reviews.findOne({where: {id: id}});
            if (!review) return res.status(401).send("Review not found")
            if(review.reported === false){
                review.reported = true
            }
            await review.save();
            res.status(200).send(review);
        }catch(err){
            console.error(err);
            res.status(401).send(err);
        };
});

router.put("/add/:id", async (req,res)=>{
    const {id} = req.params;
    console.log(req.params)
        try{
            let review = await Reviews.findOne({where: {id: id}});
            if (!review) return res.status(401).send("Review not found")
            if(review.reported === true){
                review.reported = false
            }
            await review.save();
            res.status(200).send(review);
        }catch(err){
            console.error(err);
            res.status(401).send(err);
        };
});


module.exports= router;