const { Router } = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const validateUserAuth = require('./helpers/loginGoogleHelper');

const jwt = require('jsonwebtoken');

const { SECRET_KEY, LOCALHOST1, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, URL, URL_ALLOWED } = process.env;

const router = Router();

passport.use("authGoogle", new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL:`https://ecommerceapih.herokuapp.com/login/auth/google/redirect`,
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
            const token = jwt.sign({ user: body }, SECRET_KEY, {
                expiresIn: '3h'
            })
            res.redirect('https://e-commerce-videogames.vercel.app/oauth2/'+token)
        } else {
            res.redirect(URL + '/auth/google/failure')
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
