const User = require("../models/users.models");
const { response_401 } = require("../utils.js/responseCodes.utils");

exports.adminAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            return response_401(res, "Login First");
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return response_401(res, "User not found");
        }

        if (user.role !== "admin") {
            return response_401(res, "Not an admin");
        }
        next();
    } catch (err) {
        return response_401(res, "Auth failed");
    }
};
