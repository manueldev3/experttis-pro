const stripe = require("stripe")(process.env.NEXT_PRIVATE_STRIPE_SECRET_KEY);

export default stripe;
