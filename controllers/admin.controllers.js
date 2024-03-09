const User = require("../models/users.models");
const Token = require("../models/token.model");

const {
    response_200,
    response_500,
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
