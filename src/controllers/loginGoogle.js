const { Router } = require('express');
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2').Strategy;

const { Users, AuthUsers } = require('../db');

const validateUserAuth = require('./helpers/loginGoogleHelper');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, URL} = process.env;

const router = Router();

const {URL_ALLOWED} = process.env

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${URL}/login/auth/google/redirect`,
}, async function( request, accessToken, refreshToken, profile, cb) {
    const user = await validateUserAuth(profile)
    console.log(user)
    return cb(null, user);
}));


passport.serializeUser((user, done) =>{
    console.log('serializeUser google')
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    console.log('deserializeUser google')
    const user = id.length > 3 ? await AuthUsers.findByPk(id): await Users.findByPk(id);
    done(null, user)
});

router.get( '/google/redirect',
  passport.authenticate( 'google', {
    successRedirect: URL_ALLOWED+'/home',
    failureRedirect: '/auth/google/failure', 
    session:true
  })
);

router.get('/google', passport.authenticate('google', 
{ scope: ['email', 'profile'] }
));

router.get('/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

module.exports = router;