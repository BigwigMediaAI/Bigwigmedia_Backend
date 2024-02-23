const User = require("../models/users.models");
const { response_401, response_404, response_400, response_500 } = require("../utils.js/responseCodes.utils");

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find().select("name email image");
        res.status(200).json({
            data: users,
            message: "Users found",
            status: "OK",
        });
    } catch (err) {
        return response_500(res, "Error getting users", err);
    }
};

exports.editUser = async (req, res) => {
    try {
        const { name, email, image, id } = req.body;
        if (!name || !email || !image)
            return response_400(res, "Name, email and image are required");
        if (!req.user) return response_401(res, "Auth failed");
        const user = await User.findById(req.user._id);
        if (!user) return response_404(res, "User not found");
        if (user._id.toString() !== id)
            return response_401(res, "Unauthorized");

        user.name = name;
        user.email = email;
        user.image = image;
        await user.save();
        res.status(200).json({
            data: user,
            message: "User updated",
            status: "OK",
        });
    } catch (err) {
        return response_500(res, "Error updating user", err);
    }
};
