const User = require("../models/users.models");
const { response_401 } = require("../utils.js/responseCodes.utils");

exports.auth = async (req, res, next) => {
    try {
        const { clerkId } = req.query;
        console.log(req.query)
        if (!clerkId) {
            req.user = false;
            return next();
        }
        let user = await User.findOne({ clerkId });
        if (!user) {
            user = new User({ clerkId });
            await user.save();
        }
        console.log("auth")
        console.log(user);
        req.user = user;
        next();
    } catch (err) {
        return response_401(res, "Auth failed");
    }
};
