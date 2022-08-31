const { Router } = require('express');
const conVideogames = require ("../controllers/conVideogames")
const conGenres = require ("../controllers/conGenres")

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/", conVideogames);
router.use("/genres", conGenres);


module.exports = router;
