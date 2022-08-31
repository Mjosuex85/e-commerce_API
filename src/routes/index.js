const { Router } = require('express');
const conVideogames = require ("../controllers/conVideogames")
const conGenres = require ("../controllers/conGenres")
const conPlatforms = require ("../controllers/conPlatforms")

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/videogames", conVideogames);
router.use("/genres", conGenres);
router.use("/platforms", conPlatforms);


module.exports = router;
