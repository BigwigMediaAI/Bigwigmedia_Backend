const User = require("../models/users.models");
const Token = require("../models/token.model");

const PLAN = require("../enums/plan.enums");

const {
    response_200,
    response_500,
    response_401,
} = require("../utils.js/responseCodes.utils");

exports.getAllUserData = async (req, res) => {
    try {
        const users = await User.find();
        const userArray = [];
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const token = await Token.findOne({ user: user._id });
            const userObj = {
                name: user.name,
                email: user.email,
                plan: token.getCurrentPlan(),
                planHistory: token.getPlansDetails(),
            };
            if (user.referral) {
                userObj.referral = await User.findById(user.referral);
            }
            userArray.push(userObj);
        }

        response_200(res, "success", userArray);
    } catch (error) {
        response_500(res, error);
    }
};

exports.addCreditM = async (req, res) => {
    try {
        const userId = req.body.userId;
        const credit = req.body.credit;
        const days = req.body.days;

        const token = await Token.findOne({ user: userId });
        if (!token) {
            response_401(res, "User not found");
        }
        const currentToken = token.addPlanByAdmin(credit, days);

        response_200(res, "Credit added", currentToken);
    } catch (err) {
        response_500(res, err);
    }
};
