const { Router } = require('express');
const passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');

const { Users } = require('../../db');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, URL} = process.env;


const router = Router();

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `http://${URL}/auth/google/redirect`,
    passReqToCallback: true,
}, function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

passport.serializeUser((user, done) =>{
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    const user = await Users.findByPk(id) 
    done(null, user)
});

router.get( '/google/redirect',
  passport.authenticate( 'google', {
    successRedirect: '/user',
    failureRedirect: '/auth/google/failure'
  })
);

router.get('/google', passport.authenticate('google', 
{ scope: [ 'email', 'profile' ] }
));

router.get('/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

module.exports = router;