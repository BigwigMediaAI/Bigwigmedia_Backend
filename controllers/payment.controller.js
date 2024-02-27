const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getPaymentm = async (req, res) => {
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
        success_url: "https://www.bigwigmedia.ai/success?plan=" + product.name,
        cancel_url: "https://www.bigwigmedia.ai/cancel",
    });
    res.json({ id: session.id });
};
