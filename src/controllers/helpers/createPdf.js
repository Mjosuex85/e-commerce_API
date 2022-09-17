const { PDFDocument } = require('pdf-lib');
const { readFile, writeFile } = require('fs/promises');
const QRCode = require('qrcode-svg');

async function createPdf(user, product) {
    try {
        const pdf = await PDFDocument.load(await readFile(__dirname + '/order-pay.pdf'));
        const page = pdf.getPages();

        const infoUser = ` 
        ${user.name} ${user.lastname}
        ${new Date().toDateString()}
        ID Order: ${user.id}000000
        `,

            infoGame = `
        ${product.name}

        Rating: ${product.rating}
        Price: $ ${product.price}
        `,

            license = `
        License Key: 
        XX00-XX00-XX00-XX00-XX00
        `,

            infoPay = `
            Your purchase was completed the day ${new Date().toUTCString()}. Your key license is unique and this will be disabled once it is activated in the product. 
            Never share your key license with anyone else. 
            Visit our site in https://e-commerce-videogames.vercel.app for more experience.
        `;

        page[0].drawText(infoUser, {
            x: 30,
            y: 540,
            size: 25,
        });

        page[0].drawText(infoGame, {
            x: 30,
            y: 440,
            size: 25,
        });

        page[0].drawText(license, {
            x: 40,
            y: 325,
            size: 20,
        });

        page[0].drawText(infoPay, {
            x: 30,
            y: 260,
            size: 8,
        });

        // const pdfSave = await pdf.save();
        const pdfSave = await pdf.saveAsBase64();
        // await writeFile(__dirname + '/order-pay.pdf', pdfSave)
        return pdfSave
    } catch (error) {
        console.log(error)
    }
}

/* function creatQr(license) {
    const qr = new QRCode({
        content: license,
        width: 500,
        height: 500,
    }).svg();
    return qr
} */
module.exports = { createPdf }