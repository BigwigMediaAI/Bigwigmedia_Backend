const User = require("../models/users.models");
const { response_400, response_500 } = require("../utils.js/responseCodes.utils");

exports.checkLimit = async (req, res, next) => {
    try {
        if(!req.user) return response_400(res, "Login First");
        const user = await User.findById(req.user._id);
        if (user.getLimits().current_limit <= 0) {
            return response_400(res, "Limit reached");
        }
        else{
          await user.descreseLimit();
        }
        next();
    } catch (error) {
        response_500(res, "Error getting limits", error);
    }
}