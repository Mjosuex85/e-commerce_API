
const Router = require('express');
const router = Router();

const bcrypt = require('bcrypt');

const { Users } = require('../db.js');
const { validateUserRegister } = require('./helpers/signupHelper.js');
const {confirmEmail} = require('./helpers/sendEmail.js');

const { KEY_SALT } = process.env;
const keySalt = parseInt(KEY_SALT);

var default_profile_pic = ['https://play.nintendo.com/images/profile-mk-mario.7bf2a8f2.png','https://play.nintendo.com/images/profile-mk-luigi.ef9f1228.png',
                             'https://play.nintendo.com/images/profile-mk-yoshi.babe07bc.png', 'https://play.nintendo.com/images/profile-mk-bowser.062bfe67.png', 
                             'https://play.nintendo.com/images/profile-mk-waluigi.84cc1208.png', 'https://play.nintendo.com/images/profile-mk-toad.7df41cfd.png', 
                             'https://play.nintendo.com/images/profile-mk-koopa.27049d38.png', 'https://play.nintendo.com/images/profile-mk-goomba.5c705bdc.png', 
                             'https://play.nintendo.com/images/profile-mk-peach.59f7e05a.png', 'https://play.nintendo.com/images/profile-dk-donkeykong.03c4b02b.png',
                             'https://play.nintendo.com/images/profile-mk-shyguy.fa26a762.png', 'https://play.nintendo.com/images/profile-mk-kamek.6885e0cf.png']

router.post('/', async (req, res )=>{
    try {
        var {username, name, lastname, email, profile_pic} = req.body;
        let {password} = req.body;
        
        // const validateUser = await validateUserRegister(username, name, lastname, email, password);
        const validateUser = true
        if (validateUser) {
            bcrypt.hash(password, keySalt, async function (err, hash) {
                if(err) throw new Error('something is wrong with the password'); 
                password = hash;
                if(!profile_pic) profile_pic = default_profile_pic[Math.floor(Math.random() * default_profile_pic.length)]
                await Users.create({username, name, lastname, email, password, profile_pic});
            })
            confirmEmail(email)
        }
        confirmEmail(email);
        res.send('Register Complete');
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.get('/', (req, res) =>{
    res.json({"message":'send a post to signin'});
})


module.exports= router;