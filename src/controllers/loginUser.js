const { Router } = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy;

const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

const { Users } = require('../db');

const loginGoogle = require('./loginGoogle');

const router = Router();

const { SECRET_KEY } = process.env

router.use('/auth', loginGoogle);

passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await Users.findOne({ where: { email } });
        if (user && !user.isBanned) {
            let passwordMatch = await bcrypt.compare(password, user.password)
            if (email === user.email && passwordMatch) {
                return done(null, user);
            }
        }
        return done(null, false);
    } catch (e) {
        return done(e)
    }
}))

passport.use(new JWTStrategy({
    secretOrKey: SECRET_KEY,
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('tkn')
}, async (token, done) => {
    try {
        return done(null, token.user)
    } catch (e) {
        done(error)
    }
}))

router.post('/', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                return res.redirect('/login')
            }
            req.login(user, { session: false }, async (err) => {
                if (err) return next(err)
                const body = { id: user.id, email: user.email }
                const token = jwt.sign({ user: body }, SECRET_KEY, { expiresIn: '60s' })
                res.json({ token })
            })
        }
        catch (e) {
            return next(e)
        }
    })(req, res, next)
})

router.get('/', (req, res) => {
    console.log('Not Autheticaded')
    res.json({ "message": 'Not Autheticaded' })
});

module.exports = router;