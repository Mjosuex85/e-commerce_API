const { Router } = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const { Users, AuthUsers } = require('../db');

const validateUserAuth = require('./helpers/loginGoogleHelper');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, URL } = process.env;

const router = Router();

const { URL_ALLOWED } = process.env

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${URL}/login/auth/google/redirect`,
}, async function (request, accessToken, refreshToken, profile, cb) {
    const user = await validateUserAuth(profile)
    return cb(null, user);
}));


passport.serializeUser((user, done) => {
    console.log('this is serialize user', user.id)
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    console.log('this is deserialize user', id)
    if(id.length > 3){
        console.log('this is deserialize user with google strategy', user)
        const user = await AuthUsers.findByPk(id)
        done(null, user)
    }else{
        const user = await Users.findByPk(id)
        console.log('this is deserialize user with local strategy', user)
        done(null, user)
    }      
});

router.get('/google/redirect',
    passport.authenticate('google', {
        successRedirect: URL_ALLOWED + '/home',
        failureRedirect: '/auth/google/failure',
        session: true
    })
);

router.get('/google', passport.authenticate('google',
    { scope: ['email', 'profile'] }
));

router.get('/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

router.post('/', passport.authenticate('local', {
    successRedirect: "/user",
    failureRedirect: "/login"
}));

router.get('/', (req, res) => {
    console.log('Not Autheticaded')
    res.json({ "message": 'Not Autheticaded' })
});

module.exports = router;