const User = require("../models/users.models");
const Templete = require("../models/templetes.models");
const { response_200 } = require("../utils.js/responseCodes.utils");

exports.getLimit = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const limits = user.getLimits();
        response_200(res, "Limits found", limits);
    } catch (error) {
        response_200(res, "Error getting limits", error);
    }
}

