const { Router } = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const { Users, AuthUsers } = require('../db');

const validateUserAuth = require('./helpers/loginGoogleHelper');

const jwt = require('jsonwebtoken')

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, URL } = process.env;

const router = Router();

const { URL_ALLOWED, SECRET_KEY } = process.env

/* passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${URL}/login/auth/google/redirect`,
}, async function (request, accessToken, refreshToken, profile, cb) {
    console.log(accessToken)
    const user = await validateUserAuth(profile)
    return cb(null, user);
})); */

passport.use("authGoogle", new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${URL}/login/auth/google/redirect`,
    },
    async (request, accessToken, refreshToken, profile, done) => {
        const user = await validateUserAuth(profile)
        return done(null, user);
    }
));

router.get('/google/redirect',
    passport.authenticate('authGoogle', {
        session: false
    }),
    async (req, res) => {
        if (req.user) {
            const body = { id: req.user.id, email: req.user.email }
            console.log(body)
            const token = jwt.sign({ user: body }, SECRET_KEY, {
                expiresIn: '60s'
            })
            res.cookie('token', token);
            res.redirect('https://e-commerce-videogames.vercel.app/home')
        } else {
            res.redirect(URL +'/auth/google/failure')
        }
    }
);

router.get('/google', passport.authenticate('authGoogle',
    { scope: ['email', 'profile'] }
));

router.get('/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});


module.exports = router;
