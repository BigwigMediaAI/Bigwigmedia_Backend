const User = require("../models/users.models");
const Token = require("../models/token.model");

const PLAN = require("../enums/plan.enums");

const {
    response_200,
    response_500,
    response_401,
} = require("../utils.js/responseCodes.utils");

exports.getAllUserData = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const userCount = await User.countDocuments();
        const numberOfPages = Math.ceil(userCount / limit);
        const users = await User.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);
        const userArray = [];
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const token = await Token.findOne({ user: user._id });
            // if (!token) continue;
            const userObj = {
                registeredAt: user.createdAt,
                _id: user._id,
                clientId: user.clerkId,
                name: user.name,
                email: user.email,
                plan: token.getCurrentPlan(),
                planHistory: token.getPlansDetails(),
            };
            if (user.referral) {
                userObj.referral = await User.findById(user.referral);
            }
            userArray.push(userObj);
        }

        response_200(res, "success", {
            users: userArray,
            numberOfPages,
            userCount,
            limit,
            page,
        });
    } catch (error) {
        response_500(res, error);
    }
};

exports.addCreditM = async (req, res) => {
    console.log(req.body);
    try {
        const userId = req.body.userId;
        const credit = req.body.credit;
        const days = req.body.days;

        const token = await Token.findOne({ user: userId });
        if (!token) {
            response_401(res, "User not found");
        }
        // console.log(token, "Before adding credit");
        const currentToken = await token.addPlanByAdmin(credit, days);
        // console.log(currentToken, "After adding credit");
        response_200(res, "Credit added", currentToken);
    } catch (err) {
        response_500(res, err);
    }
};

exports.searchUser = async (req, res) => {
    try {
        const email = req.query.email;
        const name = req.query.name;
        const creditGreaterThan = req.query.creditGreaterThan;
        const creditLessThan = req.query.creditLessThan;
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;

        // email and name are present in the user model, while currentLimit is present in the token model
        const queryArray = [];
        if (email) {
          queryArray.push({ email: { $regex: email, $options: "i" } });
        }
        if (name) {
          queryArray.push({ name: { $regex: name, $options: "i" } });
        }
        let users;
        if (queryArray.length)
          users = await User.find({
            $or: queryArray,
          }).sort({ createdAt: -1 });
        else users = await User.find().sort({ createdAt: -1 });

        let userArray = [];
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          const token = await Token.findOne({ user: user._id });
          if (!token) continue;
          if (
            (creditGreaterThan && token.currentLimit < creditGreaterThan) ||
            (creditLessThan && token.currentLimit > creditLessThan)
          ) {
            continue;
          }
          const userObj = {
            registeredAt: user.createdAt,
            _id: user._id,
            clientId: user.clerkId,
            name: user.name,
            email: user.email,
            plan: token.getCurrentPlan(),
            planHistory: token.getPlansDetails(),
          };
          if (user.referral) {
            userObj.referral = await User.findById(user.referral);
          }
          userArray.push(userObj);
        }

        // Calculate total number of users
        const totalUsers = userArray.length;

        // Apply pagination
        userArray = userArray.slice((page - 1) * limit, page * limit);

        response_200(res, "success", {
          users: userArray,
          numberOfPages:parseInt(totalUsers/limit+1),
          userCount:totalUsers,
          limit,
          page,
        });

    } catch (error) {
        response_500(res, error);
    }
};
