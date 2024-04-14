const User = require("../models/users.models");
const Templete = require("../models/templetes.models");
const { response_200 } = require("../utils.js/responseCodes.utils");

exports.getLimit = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const limits = user.getLimits();
        console.log(limits)
        response_200(res, "Limits found", limits);
    } catch (error) {
        response_200(res, "Error getting limits", error);
    }
};

exports.decreaseLimit = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.decreaseLimit();
        response_200(res, "Limit decreased", user.getLimits());
    } catch (error) {
        response_200(res, "Error decreasing limits", error);
    }
};


exports.increaseLimit = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user){
            res.status(200).send({msg:"user not found"})
        }
        const increase = req.body.increase;
        const plan = req.body.plan;
        user.increaseLimit(increase,plan);
        response_200(res, "Limit increased", user.getLimits());
    } catch (error) {
        response_200(res, "Error increasing limits", error);
    }
}