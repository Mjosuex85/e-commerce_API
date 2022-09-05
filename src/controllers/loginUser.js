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
    let passwordMatch = await bcrypt.compare(password, user.dataValues.password)
    console.log(passwordMatch);
    console.log(email === user.email);
    if(email === user.email && passwordMatch){
        console.log('--------------entro-----------------')
        return cb(null, {id:user.id, email:user.email});
    }}
    return cb(null, false);
}));

passport.serializeUser((user, done) =>{
    console.log(user)
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    const user = await Users.findByPk(id) 
    console.log(user);
    done(null, user)
});

router.post('/', passport.authenticate('local', {
    successRedirect: "/user" ,
    failureRedirect: "/login"
}));

router.get('/', (req, res) =>{
    console.log('Not Autheticaded')
    res.json({"message":'Not Autheticaded'})
});

module.exports = router;