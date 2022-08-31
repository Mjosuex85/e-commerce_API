const { Router } = require('express');
const conVideogames = require ("../controllers/conVideogames")
const conGenres = require ("../controllers/conGenres")
const conPlatforms = require ("../controllers/conPlatforms")
const loginUser = require("../controllers/loginUser")
const landing = require("../controllers/landing")

const router = Router();

router.use("/", conVideogames);
router.use("/videogames", conVideogames);
router.use("/genres", conGenres);
router.use("/platforms", conPlatforms);
router.use("/login", loginUser);

module.exports = router;
