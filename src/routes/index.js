const { Router } = require('express');
const {conVideogames} = require ("../controllers/conVideogames")

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/', conVideogames);


module.exports = router;
