const paypal = require("paypal-rest-sdk");
const { Router } = require('express');
const router = Router();

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
        "AX6SYjfkRQUQvmPBwEsfB8dcMjOZ6IoccjHqPbxmXWIHN5m-W38Ed4KWYANgEpenI2fISiF6JDW880dw",
    client_secret:
        "EMzJANetjGL5GEyh2NqZSor1WEXMEgJ_tKIxls6BkMEqSvKw55qz5pY6rsJIlhg3OV6bu2dtyya18pLf"
});

router.get("/rend", (req, res) => {
    res.render("index");
});

router.get("/", (req, res) => {
    try{
    
        let price = req.query.price;

        var create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: `${process.env.URL}paypal/success?price=${price}`,
                cancel_url: `${process.env.URL}paypal/cancel`
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: "item",
                                sku: "games",
                                price: price,
                                currency: "BRL",
                                quantity: 1
                            }
                        ]
                    },
                    amount: {
                        currency: "BRL",
                        total: price
                    },
                    description: "This is the payment description."
                }
            ]
        };

        paypal.payment.create(create_payment_json, function(error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                res.redirect(payment.links[1].href);
            }
        });

    }catch(err){
        console.log(err)
    }
});

router.get("/success", (req, res) => {
    try{
    let price = req.query.price;
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: "BRL",
                    total: price
                }
            }
        ]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(
        error,
        payment
    ) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.render("success");
        }
    });
    }catch(err){
        console.log(err)
    }
});

router.get("cancel", (req, res) => {
    res.render("cancel");
});


module.exports = router;