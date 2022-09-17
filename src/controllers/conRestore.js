
const Router = require('express');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, URL } = process.env;
const {Products,Users, Order, AuthUser} = require("../db.js");
const router = Router();
const { validate } = 'class-validator';

// FORGOT PASSWORD
const {forgotPassword} = require ("./helpers/sendEmail")

router.put('/restore', async (req, res, next)=>{
    try{
        
    }catch(e){
        next(e)
    }
});

router.get('/', async (req, res, next)=>{
    try{
        const {email}= req.query;
        console.log("🚀 ~ file: conRestore.js ~ line 23 ~ router.get ~ email", email)
        
        if (!email){
            return res.status(400).json({message:"Insert a registered E-Mail please"});
        }
        const message=`Please check your e-mail for your link to change the password.`;
        let verificationLink;
        let emailStatus = 'Ok';
        

        // try{ -- AGREGADO
        let userLocal = await Users.findOne({where:{email: email}})
        
        const token = jwt.sign({userId: userLocal.id, username: userLocal.username}, SECRET_KEY, { expiresIn: '45m'})

        verificationLink= `${process.env.URL_ALLOWED}/changepass/${userLocal.id}/${token}`
        
        userLocal.resetToken=token        

        res.send(userLocal.resetToken)
        forgotPassword(email, verificationLink);
        // }catch (error){ -- AGREGADO
        //     return res.json({"El usuario ingresado no esta registrado en la base de datos"})
        // }

        
    }catch(e){
        next(e)
    }
});

router.put('/newpassword/:id/:token', async (req, res, next)=>{
    try{
        const { newPassword } = req.body;
       
        const { token } = req.params;
        const { id } = req.params;
        
        
        resetToken = JSON.stringify(token)

        if ( !newPassword || !token){
            res.status(400).json({message: "All fields are required "})
        }
        let jwtPayload = jwt.verify(token, SECRET_KEY);
        console.log("🚀 ~ file: conRestore.js ~ line 75 ~ router.put ~ jwtPayload", jwtPayload)
        
       
        await Users.update({
                password: newPassword,
            }, {
                where: {
                    id: [id],
            }})
        
        res.status(200).send({message:"Password Changed!"})
        
       
        //falta res, ver video min24'

    }catch(e){
        next(e)
    }
});
module.exports = router;

