const nodemailer = require("nodemailer");

async function buyConfirm(email) {
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
  try {
    await transporter.sendMail({
      from: '"Steamm" <steamm38mm@example.com>',
      to: email,
      subject: "Confirmacion de compra ✔",
      html: "<b>Compradoo</b>"
    })
  } catch (error) {
    console.log(error)
  }
}

async function confirmEmail(email) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "steamm38mm@gmail.com",
      pass: "onadhntjkskmkdif",
    }
  });
  try {
    await transporter.sendMail({
      from: 'Games E-commerce <steamm38mm@gmail.com>',
      to: email,
      subject: "Confirm your Email",
      html: `
      <h1>Welcome on this new experience</h1>
      <br/>
      <p>To continue please verify your Email</p>
      <br/>
      <a href="https://e-commerce-videogames.vercel.app/verify/${email}">Verify<a>
      ` 
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { buyConfirm, confirmEmail }