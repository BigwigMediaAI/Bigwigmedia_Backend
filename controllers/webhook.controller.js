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
    console.log("data", data);
    const customer = await stripe.customers.retrieve(data.customer);
    console.log("customer:", customer);
  }

  res.status(200).end();
};
