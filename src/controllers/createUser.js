const Router = require('express')
const router = Router()

const bcrypt = require('bcrypt');

const { Users } = require('../db.js');
const { validateUserRegister } = require('./helpers/signupHelper.js');

const { KEY_SALT } = process.env;
const keySalt = parseInt(KEY_SALT);

router.post('/', async (req, res )=>{
    try {
        const {username, name, lastname, email, profile_pic} = req.body;
        let {password} = req.body;
        const validateUser = await validateUserRegister(username, name, lastname, email, password);
        if (validateUser) {
            bcrypt.hash(password, keySalt, async function (err, hash) {
                if(err) throw new Error('something is wrong with the password') 
                password = hash
                await Users.create({username, name, lastname, email, password, profile_pic})
            })
        }
        res.send('Register Complete')
    } catch (error) {
        console.log(error)
        res.status(404).send(error.message)
    }
})

router.get('/', (req, res) =>{
    res.json({"message":'send a post'})
})

module.exports= router;