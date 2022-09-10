const nodemailer = require("nodemailer");


async function confirmacionCompra(email) {
let testAccount = await nodemailer.createTestAccount();


  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "steamm38mm@gmail.com",
      pass: "onadhntjkskmkdif",
    }
  });

try{
    await transporter.sendMail({
    from: '"Steamm" <steamm38mm@example.com>',
    to: email,
    subject: "Confirmacion de compra ✔",
    html: "<b>Compradoo</b>"
    
    
})
  } catch(error){
    emailStatus = error;
    console.log(error)
    
  }}

  async function confirmEmail(email) {
    let testAccount = await nodemailer.createTestAccount();
    
    
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "steamm38mm@gmail.com",
          pass: "onadhntjkskmkdif",
        }
      });
    
    try{
        await transporter.sendMail({
        from: '"Steamm" <steamm38mm@example.com>',
        to: email,
        subject: "Confirm you email",
        html: "<b>confirm Email</b>"
        
        
    })
      } catch(error){
        emailStatus = error;
        console.log(error)
        
      }}

  module.exports = {confirmacionCompra, confirmEmail}