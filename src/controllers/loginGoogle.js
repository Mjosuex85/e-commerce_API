const { Router } = require('express');
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const { Users } = require('../db');
const { UserAuth } = require('../models/userAuth');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, URL} = process.env;


const router = Router();

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${URL}login/auth/google/redirect`,
    passReqToCallback: true,
}, async function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

passport.serializeUser((user, done) =>{
    console.log(user)
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    const user = await Users.findByPk(id) 
    done(null, user)
});

router.get( '/google/redirect',
  passport.authenticate( 'google', {
    successRedirect: '/user/auth',
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