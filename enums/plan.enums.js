const PLAN = {
    FREE: {
        name: "FREE",
        limit: 30,
        expairy: 7,
        price: 0,
    },
    MONTHLY: {
        name: "MONTLY",
        limit: 200,
        expairy: 30,
        price: 20,
    },
    YEARLY: {
        name: "YEARLY",
        limit: 2550,
        expairy: 365,
        price: 100,
    },
    TOPUP: {
        name: "TOPUP",
        limit: 100,
        expairy: -1, // Till current plan is active
        price: 10,
    },
};

Object.values(PLAN);

module.exports = PLAN;