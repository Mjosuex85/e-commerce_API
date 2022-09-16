const { Router } = require('express');

const conVideogames = require ("../controllers/conVideogames")
const conGenres = require ("../controllers/conGenres")
const conPlatforms = require ("../controllers/conPlatforms")
const loginUser = require("../controllers/loginUser")
const logout = require("../controllers/logout")
const createUser = require('../controllers/createUser')
const landingUser = require('../controllers/landingUser')
const UserRouter = require("../controllers/UserRouter")
const payment = require("../controllers/payment")
const reviews = require("../controllers/conReviews")
const conOrder = require("../controllers/conOrder")
const editProfile = require("../controllers/conEditProfile")
const conCart = require("../controllers/conCart")

const conRestore = require("../controllers/conRestore")

const paypal = require("../controllers/paypal")


const router = Router();

router.use("/videogames", conVideogames);
router.use("/genres", conGenres);
router.use("/platforms", conPlatforms);
router.use("/login", loginUser);
router.use("/logout", logout);
router.use("/signin", createUser);
router.use("/user", landingUser);
router.use("/user/editprofile", editProfile);
router.use("/users", UserRouter);
router.use("/payment", payment);
router.use("/reviews", reviews);
router.use("/order", conOrder);
router.use("/cart", conCart);

router.use("/restore", conRestore);

router.use("/paypal", paypal);


module.exports = router;
