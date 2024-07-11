const PLAN = {
    FREE: {
        name: "FREE",
        limit: 30,
        expairy: 7,
        price: 0,
    },
    MONTHLY: {
        name: "MONTHLY",
        limit: 1000,
        expairy: 30,
        price: 499,
        Displayamount:499
    },
    YEARLY: {
        name: "YEARLY",
        limit: 14000,
        expairy: 365,
        price: 5999,
        Displayamount:5999

    },
    TOPUP: {
        name: "TOPUP",
        limit: 100,
        expairy: -1, // Till current plan is active
        price: 10,
    },
    ADMIN: {
        name: "ADMIN",
        limit: -1,
        expairy: -1, // Till current plan is active
        price: -1,
    },
};

Object.values(PLAN);

module.exports = PLAN;
