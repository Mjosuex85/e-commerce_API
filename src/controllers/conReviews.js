const Router = require('express');
const router = Router();
const { Reviews, Products, Users } = require('../db.js');



router.post('/', async (req, res )=>{
    try {
        console.log(req.body)
        const {rating, description, user_id, productId} = req.body;

        let user = await Users.findOne({where: {id: user_id}});
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
                user_id: user_id,
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

            let reviewPf = await reviews.map(async (e) => {
                let user = await Users.findOne({where: {id: e.user_id}});
                
                return {...e.dataValues, profile_pic: user.profile_pic, username: user.username};
            })
            Promise.all(reviewPf).then((values) => {
                res.status(200).send(values);
            }).catch((err)=>res.status(404).send(err));          
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.get('/', async (req, res )=>{
    try {
        let user_id = req.query.user_id;
        if (user_id) {
            let user = await Users.findOne({where: {id: user_id}});
            if (!user){
                res.status(400).send('User does not exist');
            }else{
                let reviews = await Reviews.findAll({ where: { user_id: user_id }});
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

router.put("/edit", async (req,res)=>{
    try{
        let edit = req.body
        let id= req.body.id

        let keys = Object.keys(edit)
        keys.shift()

        let values = Object.values(edit)
        values.shift() 
    
        keys.map(async(k, i)=>{await Reviews.update({
            [k]: values[i],
        }, {
            where: {
                id: [id],
        }})
        });

        res.status(200).send("Review editado!")
    }catch{
        res.status(401).send(err);
    }
});

router.delete('/delete/:id', async (req, res) => {
    const {id} = req.params;
    try{
        let review = await Reviews.destroy({where: {id: id}});
        if (review < 1) return res.status(401).send("Review not found")
        res.status(200).send('Review deleted');
    }catch(err){
        console.error(err);
        res.status(401).send(err);
    };
})

module.exports= router;