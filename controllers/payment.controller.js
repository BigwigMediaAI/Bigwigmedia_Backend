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
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
exports.webhookController = async (req, res) => {
    let event;
    let data;
    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            req.headers["stripe-signature"],
            endpointSecret
        );
        data = event.data.object;
    } catch (err) {
        console.log(err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        console.log("data", data);
        const customer = await stripe.customers.retrieve(data.customer);
        console.log("customer:", customer);

        // Giving credit to customer
        const user = await User.findById(customer.metadata.userId);
        let plan;
        try {
            plan = customer.metadata.cart.name;
        } catch (error) {
            console.log("error after payment", error, customer, data);
        }

        if (!user) {
            console.error(
                "Payment received but not credit given -> ",
                customer,
                data
            );
        } else if (
            !Object.values(PLAN)
                .map((plan) => plan.name)
                .includes(plan)
        ) {
            console.error("Invalid plan -> ", plan, customer, data);
        } else {
            const tokenObj = await Token.findOne({ user: user._id });
            const newTokenObj = tokenObj.addPlanDirectBuy(PLAN[plan]); // plan added
            console.log("newTokenObj", newTokenObj);

            // Giving credit to referral
            if (user.referral) {
                const referral = await User.findById(user.referral);
                const tokenObj = await Token.findOne({ user: referral._id });
                tokenObj.addPlanRefferal(user._id);
            }
        }
    }
    res.status(200);
};
