const Templete = require("../models/templetes.models");
const {
    response_500,
    response_200,
} = require("../utils.js/responseCodes.utils");

const User = require("../models/users.models");
exports.searchTemplete = async (req, res) => {
    try {
        const { search } = req.query;
        const templetes = await Templete.find({
            name: { $regex: search, $options: "i" },
        }).select("name logo description");

        const templateObj = [];
        templetes.forEach((templete) => {
            templateObj.push({
                ...templete._doc,
                isBookmarked: false,
            });
        });

        // console.log('req user', req.user)
        if (req.user) {
            const user = await User.findById(req.user._id);
            console.log(user);
            templateObj.forEach((templete) => {
                if (user.isBookedMarked(templete._id)) {
                    templete.isBookmarked = true;
                }
            });
        }
        response_200(res, "Templetes found", templateObj);
    } catch (err) {
        return response_500(res, "Error searching templete", err);
    }
};

exports.getTemplete = async (req, res) => {
    try {
        const { id } = req.params;
        const templete = await Templete.findById(id);

        // console.log('req user', req.user)

        response_200(res, "Templete found", templete);
    } catch (err) {
        return response_500(res, "Error getting templete", err);
    }
};

exports.addTemplate = async (req, res) => {
    try {
        const { name, description, templete, labels, logo } = req.body;
        const newTemplete = new Templete({
            name,
            description,
            templete,
            labels,
            logo,
        });
        await newTemplete.save();
        response_200(res, "Templete added", newTemplete);
    } catch (err) {
        return response_500(res, "Error adding templete", err);
    }
};

exports.getLabels = async (req, res) => {
    try {
        const labels = await Templete.find().select("labels");
        const labelsArray = [];
        labels.forEach((label) => {
            label.labels.forEach((l) => {
                if (!labelsArray.includes(l)) {
                    labelsArray.push(l);
                }
            });
        });
        response_200(res, "Labels found", labelsArray);
    } catch (err) {
        return response_500(res, "Error getting labels", err);
    }
};

exports.getTempletesByLabel = async (req, res) => {
    try {
        const { label } = req.params;
        // labels is a array of strings
        const templetes = await Templete.find({
            labels: { $in: [label] },
        }).select("name logo description");

        const templateObj = [];
        templetes.forEach((templete) => {
            templateObj.push({
                ...templete._doc,
                isBookmarked: false,
            });
        });

        // console.log('req user', req.user)
        if (req.user) {
            const user = await User.findById(req.user._id);
            console.log(user);
            templateObj.forEach((templete) => {
                if (user.isBookedMarked(templete._id)) {
                    templete.isBookmarked = true;
                }
            });
        }
        response_200(res, "Templetes found", templateObj);
    } catch (err) {
        return response_500(res, "Error searching templete", err);
    }
};

exports.getAllTemplates = async (req, res) => {
    try {
        const templetes = await Templete.find().select("name logo description");
        // also send if is bookmarked or not
        const templateObj = [];
        templetes.forEach((templete) => {
            templateObj.push({
                ...templete._doc,
                isBookmarked: false,
            });
        });

        // console.log('req user', req.user)
        if (req.user) {
            const user = await User.findById(req.user._id);
            console.log(user);
            templateObj.forEach((templete) => {
                if (user.isBookedMarked(templete._id)) {
                    templete.isBookmarked = true;
                }
            });
        }

        // console.log(templateObj);
        response_200(res, "Templetes found", templateObj);
    } catch (err) {
        return response_500(res, "Error searching templete", err);
    }
};
