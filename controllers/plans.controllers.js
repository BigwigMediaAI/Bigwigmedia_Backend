const PLAN = require("../enums/plan.enums");
const User = require("../models/users.models");
const Token = require("../models/token.model");

const {
    response_200,
    response_500,
} = require("../utils.js/responseCodes.utils");

exports.getAllPlans = async (req, res) => {
    console.log("getAllPlans");
    const plan = {
        PLAN: PLAN,
    };
    if (req.user) {
        const user = await User.findById(req.user._id);
        const token = await Token.findOne({ user: user._id });
        if (token.hasValidity()) {
            plan.currentPlan = token.getCurrentPlan();
            plan.planHistory = token.getPlansDetails();
            plan.showTop = true;
        }
    }

    try {
        response_200(res, "success", PLAN);
    } catch (error) {
        response_500(res, error);
    }
};

exports.getPlanHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            response_500(res, "User not found");
        }
        const tokenObj = await Token.findOne({ user: user._id });

        const planDetails = tokenObj.getPlansDetails();

        response_200(res, "success", planDetails);
    } catch (error) {
        response_500(res, error);
    }
};

exports.getCurrentPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            response_500(res, "User not found");
        }
        const tokenObj = await Token.findOne({ user: user._id });

        const planDetails = tokenObj.getCurrentPlan();

        response_200(res, "success", planDetails);
    } catch (error) {
        response_500(res, error);
    }
};
