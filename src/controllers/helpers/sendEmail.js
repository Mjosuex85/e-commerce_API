const nodemailer = require("nodemailer");


async function main(email) {
let testAccount = await nodemailer.createTestAccount();


  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "steamm38mm@gmail.com",
      pass: "wqwymbwurasguxjs",
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

  module.exports = main