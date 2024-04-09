const User = require("../models/users.models");
const Token = require("../models/token.model");
const { response_401 } = require("../utils.js/responseCodes.utils");

const { Mutex } = require("async-mutex");
const userCreationMutex = new Mutex();

exports.auth = async (req, res, next) => {
    try {
        const { clerkId, name, email, imageUrl, address } = req.query;
        // console.log("req.query", req.query);
        // return;
        if (!clerkId) {
            req.user = false;
            return next();
        }

        const release = await userCreationMutex.acquire();
        let user = await User.findOne({
            clerkId,
        });
        // console.log(user, "user");
        // return;
        if (!user) {
            // console.log("user", user);
            // return;
            user = await User.create({
                clerkId,
                name,
                email,
                image: imageUrl,
                referral: req.query.referred || null,
                address,
            });

            const token = await Token.create({
                user: user._id,
            });

            user.token = token._id;
            await user.save();
        }
        if (!user.address) {
            user.address = address;
            await user.save();
        }
        release();
        req.user = user;
        next();
    } catch (err) {
        return response_401(res, "Auth failed");
    }
};
