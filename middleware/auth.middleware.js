const User = require("../models/users.models");
const Token = require("../models/token.model");
const { response_401 } = require("../utils.js/responseCodes.utils");
let userCreationInProgress = false;
exports.auth = async (req, res, next) => {
    try {
        const { clerkId, name, email, imageUrl, address } = req.query;
        if (!clerkId) {
            req.user = false;
            return next();
        }
        if (userCreationInProgress) {
            // Wait until user creation is completed
            await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust the delay as needed
        }
        userCreationInProgress = true;
        let user = await User.findOne({
            clerkId,
        });
        // console.log(user, clerkId, name, email, imageUrl, "swaroop")
        if (!user) {
            // console.log("swaroop");
            // check if name, email and imageUrl are present and string
            // if (
            //     !name ||
            //     !email ||
            //     !imageUrl ||
            //     typeof name !== "string" ||
            //     typeof email !== "string" ||
            //     typeof imageUrl !== "string"
            // ) {
            //     return response_401(res, "Auth failed");
            // }

            const reffered = req.query.reffered || null;
            user = new User({
                clerkId,
                name,
                email,
                image: imageUrl,
                referral: reffered,
                address,
            });
            // console.log(user, "swaroop")
            const token = new Token({
                user: user._id,
            });
            // console.log(token, "swaroop")
            user.token = token._id;
            await token.save();
            await user.save();
        }
        if (!user.address) {
            user.address = address;
            await user.save();
        }
        req.user = user;
        userCreationInProgress = false;
        next();
    } catch (err) {
        return response_401(res, "Auth failed");
    }
};
