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
<<<<<<< HEAD
        price: 200,
=======
        price: 100,
>>>>>>> b771cc896ca4cdc8801940e1f4230867b1df4b45
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
