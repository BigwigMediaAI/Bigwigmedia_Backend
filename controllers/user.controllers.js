const User = require("../models/users.models");

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
        const { name, email, image } = req.body;
        if (!name || !email || !image) return response_400(res, "Name, email and image are required");
        if(!req.user) return response_401(res, "Auth failed");
        const user = await User.findById(req.user._id);

        user.name = name;
        user.email = email;
        user.image = image;
        await user.save();
        res.status(200).json({
            data: user,
            message: "User updated",
            status: "OK",
        });
    }
    catch (err) {
        return response_500(res, "Error updating user", err);
    }
}