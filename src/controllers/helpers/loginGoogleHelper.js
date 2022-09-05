const { AuthUsers } = require('../../db')


async function validateUserAuth({id, displayName, given_name, family_name, email, picture}){    
    const usernameValidate = await AuthUsers.findOne({ where: { email } })
    
    return usernameValidate ? usernameValidate : AuthUsers.create({id: id, username:displayName, name:given_name, lastname:family_name, email:email, profile_pic:picture})
}

module.exports= validateUserAuth