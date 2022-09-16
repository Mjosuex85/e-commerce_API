
const Router = require('express');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, URL } = process.env;
const {Products,Users, Order, AuthUser} = require("../db.js");
const router = Router();
const { validate } = 'class-validator'

router.put('/restore', async (req, res, next)=>{
    try{
        
    }catch(e){
        next(e)
    }
});

router.get('/restore', async (req, res, next)=>{
    try{
        const {email}= req.body;
        if (!email){
            return res.status(400).json({message:"Insert a registered E-Mail please"});
        }
        const message=`Please check your e-mail for your link to change the password.`;
        let verificationLink;
        let emailStatus = 'Ok';
        // let userGoogle = AuthUser.findAll()

        // try{ -- AGREGADO
        let userLocal = await Users.findOneOrFail({where:{email: email}})
        // let allUsers = userLocal.concat(userGoogle)
        // let searchResults = allUsers.filter(u=>e.email===email)
        
        const token = jwt.sign({userId: userLocal.id, username: userLocal.username}, SECRET_KEY, { expiresIn: '5m'})
        verificationLink= `${URL}restore/newpassword/${userLocal.id}/${token}`
        email.resetToken=token
        // }catch (error){ -- AGREGADO
        //     return res.json({"El usuario ingresado no esta registrado en la base de datos"})
        // }


        if (searchResults[0].d.length > 6){
            AuthUser.save(searchResults[0])

        }
        
    }catch(e){
        next(e)
    }
});

router.put('/restore/newpassword/:id/:token', async (req, res, next)=>{
    try{
        const { newPassword } = req.body;
        const resetToken = req.headers.reset
        resetToken = JSON.stringify(resetToken)

        if ( !newPassword || !resetToken){
            res.status(400).json({message: "All fields are required "})
        }
        let jwtPayload = jwt.verify(resetToken, SECRET_KEY);
        let user = await Users.findOneOrFail({where:{resetToken}})

        user.password = newPassword;
        const validationOps = {validationError:{target:false, value:false}};
        const errors = await validate(user, validationOps);

        // if(errors.length > 0){ -- AGREGADO
        //    return res.status(401).json(errors);
        // }


        // try{

        user.hashPassword()
        await  Users.save(user);
        // } catch (error){ -- AGREGADO
        //     return res.status(400).json({message: "Something goes wrong"})
        // }
        // res.json({message: "Password chenged!"})

        //falta res, ver video min24'

    }catch(e){
        next(e)
    }
});
module.exports = router;

