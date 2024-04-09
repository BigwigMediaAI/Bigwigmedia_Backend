const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
exports.webhookController = async (req, res) => {
  let event;
  let data;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      endpointSecret
    );

    data = event.data.object;
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  if (event.type === "checkout.session.completed") {
    const customer = await stripe.customers.retrieve(data.customer);
    console.log("customer:", customer);

    // Giving credit to customer
    const user = await User.findById(customer.metadata.userId);
    let plan;
    try {
      plan = customer.metadata.cart.name;
    } catch (error) {
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
    } else {
      const tokenObj = await Token.findOne({ user: user._id });
      const newTokenObj = tokenObj.addPlanDirectBuy(PLAN[plan]); // plan added

      // Giving credit to referral
      if (user.referral) {
        const referral = await User.findById(user.referral);
        const tokenObj = await Token.findOne({ user: referral._id });
        tokenObj.addPlanRefferal(user._id);
      }
    }
  }

  res.status(200).end();
};
