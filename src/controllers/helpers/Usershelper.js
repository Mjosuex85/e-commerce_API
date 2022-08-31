

function validateUserRegister(name, lastname, email, password){
    const emailValidate = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email),

    nameValidate = /(^[a-zA-Z]{0,20}$)/.test(name),

    lastnameValidate = /(^[a-zA-Z]{0,20}$)/.test(lastname),
    
    passwordValidate = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,8}$/.test(password);

    if(emailValidate && nameValidate && lastnameValidate && passwordValidate) return true   
    throw new Error('Something is wrong with the register')
}

module.exports = {
    validateUserRegister
}