const User = require("../models/users.models");
const { response_401 } = require("../utils.js/responseCodes.utils");

exports.auth = async (req, res, next) => {
    try {
        const { clerkId, name, email, imageUrl } = req.query;
        if (!clerkId) {
            req.user = false;
            return next();
        }
        let user = await User.findOne({
            clerkId,
        });
        if (!user) {
            const reffered = req.query.reffered || null;
            user = new User({
                clerkId,
                name,
                email,
                image: imageUrl,
                referral: reffered,
            });
            await user.save();
        }
        req.user = user;
        next();
    } catch (err) {
        return response_401(res, "Auth failed");
    }
};
