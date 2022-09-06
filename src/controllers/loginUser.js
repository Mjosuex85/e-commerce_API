const { Router } = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local');

const { Users } = require('../db');

const loginGoogle = require('./loginGoogle');

const router = Router();

router.use('/auth', loginGoogle);

passport.use(new LocalStrategy(async function verify(email, password, cb) {
    console.log('Local Strategy info', email, password)
    const user = await Users.findOne({ where: { email } });
    console.log('Local Strategy user info',user)
    if (user && !user.isBanned) {
        let passwordMatch = await bcrypt.compare(password, user.password)
        if (email === user.email && passwordMatch) {
            console.log('done')
            return cb(null, { id: user.id, email: user.email });
        }
    }
    return cb(null, false);
}));

router.post('/', passport.authenticate('local', {
    successRedirect: "/user",
    failureRedirect: "/login"
}));

router.get('/', (req, res) => {
    console.log('Not Autheticaded')
    res.json({ "message": 'Not Autheticaded' })
});

module.exports = router;