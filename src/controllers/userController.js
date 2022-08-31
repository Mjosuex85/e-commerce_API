const Router = require('Express')
const router = Router()

const bcrypt = require('bcrypt');

const { Users } = require('../db.js');
const { validateUserRegister } = require('./helpers/Usershelper.js');

const { KEY_SALT } = process.env;
const keySalt = parseInt(KEY_SALT);

router.post('/', async (req, res )=>{
    try {
        const {username, name, lastname, email} = req.body;
        let {password} = req.body;
        if ( validateUserRegister(name, lastname, email, password) ) {
            bcrypt.hash(password, keySalt, async function (err, hash) {
                if(err) throw new Error('something is wrong with the password') 
                password = hash
                await Users.create({username, name, lastname, email, password})
            })
        }
        res.send('Register Complete')
    } catch (error) {
        res.status(404).send(error.message)
    }
})

module.exports= router;