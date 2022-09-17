const nodemailer = require("nodemailer");

async function buyConfirm(email, pdf) {

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
      html: `
        <h1>Thanks for your buy</h1>
        <p>See your games in <a href="https://e-commerce-videogames.vercel.app/my_store">the Store</a> <p>
      `,
      attachments:[{path : 'data:application/pdf;base64,'+ pdf}]
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