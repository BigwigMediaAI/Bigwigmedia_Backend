const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/users.models");
const Token = require("../models/token.model");
const PLAN = require("../enums/plan.enums");

exports.getPaymentm = async (req, res) => {
    console.log(req.body.product)
    const customer = await stripe.customers.create({
        metadata: {
            userId: req.user._id,
            cart: JSON.stringify(req.body.product),
        },
    });
    const { product } = req.body;
    // console.log(customer)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.limit + " Credits",
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer: customer.id,
      success_url: "https://www.bigwigmedia.ai/success",
      cancel_url: "https://www.bigwigmedia.ai/cancel",
    });
    
    res.json({ id: session.id });
};

