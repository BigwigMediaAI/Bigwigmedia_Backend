const PLAN = {
    FREE: {
        name: "FREE",
        limit: 30,
        expairy: 7,
        price: 0,
    },
    MONTHLY: {
        name: "MONTLY",
        limit: 300,
        expairy: 30,
        price: 10,
        Displayamount:1000
    },
    YEARLY: {
        name: "YEARLY",
        limit: 4000,
        expairy: 365,
        price: 100,
        Displayamount:10000

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
