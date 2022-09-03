const { Router } = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local');

const { Users } = require('../db');

const loginGoogle = require('./loginGoogle');

const router = Router();

router.use('/auth', loginGoogle);

passport.use(new LocalStrategy( async function verify(email, password, cb){
    const user = await Users.findOne({where:{email}});
    if(user && !user.isBanned){
        const passwordMatch = await bcrypt.compare(password, user.password)
        if(email === user.email && passwordMatch){
            return cb(null, {id:user.id, email:user.email});
        }
    }
    return cb(null, false);
}));

passport.serializeUser((user, done) =>{
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    const user = await Users.findByPk(id) 
    done(null, user)
});

router.post('/', passport.authenticate('local', {
    successRedirect: `/user`,
    failureRedirect: '/signin'
}));

router.get('/', (req, res) =>{
    res.json({"message":'send a post'})
});

module.exports = router;