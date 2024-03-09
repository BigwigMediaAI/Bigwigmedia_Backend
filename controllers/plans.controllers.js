const PLAN = require("../enums/plan.enums");
const User = require("../models/user.model");

const {
    response_200,
    response_500,
} = require("../utils.js/responseCodes.utils");

exports.getAllPlans = async (req, res) => {
    try {
        response_200(
            res,
            "success",
            PLAN.filter((plan) => plan.name !== "FREE")
        );
    } catch (error) {
        response_500(res, error);
    }
};


exports.getPlanHistory = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select("plans");
        

    } catch (error) {
        response_500(res, error);
    }
}