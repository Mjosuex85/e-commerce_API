const { Router } = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const { Users } = require('../db')

const router = Router();

const { KEY_SALT } = process.env;
const keySalt = parseInt(KEY_SALT);


passport.use(new LocalStrategy( async function verify(username, password, cb){
    const user = await Users.findOne({where:{email: username}}),
    passwordKey = await Users.findOne({where:{email: username}});
    let passwordMatch;
    bcrypt.compare(password, passwordKey, function (err, hash) {
        if(err) throw new Error('something is wrong with the password at Login') 
        passwordMatch = passwordKey === hash ? true : false;
    })
    if(username === user.email && passwordMatch){
        return cb(null, {id:user.id, name:user.name})
    }
    return cb(null, false)
}));

passport.serializeUser((user, done) =>{
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    const user = await Users.findByPk(id) 
    done(null, user)
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/platforms',
    failureRedirect: '/signup'
}));

module.exports = router;