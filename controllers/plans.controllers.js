const PLAN = require("../enums/plan.enums");
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
        response_200(res, "success", req.user.token.plans);
    } catch (error) {
        response_500(res, error);
    }
}