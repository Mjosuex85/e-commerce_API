const { Router } = require('express');

const conVideogames = require ("../controllers/conVideogames")
const conGenres = require ("../controllers/conGenres")
const conPlatforms = require ("../controllers/conPlatforms")
const loginUser = require("../controllers/login-logout/loginUser")
const logout = require("../controllers/login-logout/logout")
const createUser = require('../controllers/createUser')
const landingUser = require('../controllers/landingUser')

const router = Router();

router.use("/videogames", conVideogames);
router.use("/genres", conGenres);
router.use("/platforms", conPlatforms);
router.use("/login", loginUser);
router.use("/logout", logout);
router.use("/signup", createUser);
router.use("/user", landingUser);

module.exports = router;
