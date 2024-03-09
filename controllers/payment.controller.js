const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getPaymentm = async (req, res) => {
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.user._id,
        cart: JSON.stringify(req.body.product),
      },
    });
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price * 100,
                },
                quantity: product.quantity,
            },
        ],
        mode: "payment",
        customer: customer.id,
        success_url: "https://www.bigwigmedia.ai/success",
        cancel_url: "https://www.bigwigmedia.ai/cancel",
    });
    res.json({ id: session.id });
};
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ;
exports.webhookController = async (req, res) => {
    let event;
    let data;
    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            req.headers["stripe-signature"],endpointSecret
            
        );
        data  = event.data.object;
    } catch (err) {
        console.log(err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        console.log("data",data)
        const customer = await stripe.customers.retrieve(data.customer);
        console.log("customer:",customer)
    }
    res.status(200);
}
