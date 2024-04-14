const {
    response_500,
    response_201,
    response_200,
    response_400,
} = require("../utils.js/responseCodes.utils");
const Objects = require("../models/objects.models");
const Group = require("../models/group.models");
const Input = require("../models/input.models");
const generateResponse = require("../utils.js/generateResponse.utils");
const User = require("../models/users.models");

exports.addInput = async (req, res) => {
    try {
        const { text, placeholder, gpt, type, options, required } = req.body;
        const newInput = new Input({
            text,
            placeholder,
            gpt,
            type,
            options,
            required,
        });
        await newInput.save();
        response_201(res, newInput);
    } catch (error) {
        response_500(res, "Error adding input", error);
    }
};

exports.addGroup = async (req, res) => {
    try {
        const { inputs } = req.body;
        const newGroup = new Group({
            inputs,
        });
        await newGroup.save();
        response_201(res, newGroup);
    } catch (error) {
        response_500(res, "Error adding group", error);
    }
};

exports.addObject = async (req, res) => {
    try {
        const {
            name,
            accoName,
            description,
            groups,
            labels,
            logo,
            accoLogo,
            faq,
            groupBy,
        } = req.body;
        const newObject = new Objects({
            name,
            accoName,
            description,
            groups,
            labels,
            logo,
            accoLogo,
            faq,
            groupBy,
        });
        await newObject.save();
        response_201(res, newObject);
    } catch (error) {
        response_500(res, "Error adding object", error);
    }
};

exports.addObjectOnce = async (req, res) => {
    try {
        const {
            name,
            accoName,
            description,
            tagLine,
            isUpcomming,
            groups,
            labels,
            logo,
            accoLogo,
            faq,
            groupBy,
        } = req.body;
        const newObject = new Objects({
            name,
            accoName,
            description,
            isUpcomming,
            tagLine,
            groups,
            labels,
            logo,
            accoLogo,
            faq,
            groupBy,
        });
        await newObject.save();

        response_201(res, newObject);
    } catch (error) {
        response_500(res, "Error adding object", error);
    }
};

exports.getObjects = async (req, res) => {
    try {
        const objects = await Objects.find().select(
            "name logo description tagLine isUpcomming labels"
        );

        const objectArr = [];

        objects.forEach((object) => {
            objectArr.push({
                ...object._doc,
                isBookmarked: false,
            });
        });

        if (req.user) {
            const user = await User.findById(req.user._id);
            user.bookmarks.forEach((bookmark) => {
                objectArr.forEach((object) => {
                    if (bookmark.equals(object._id)) {
                        object.isBookmarked = true;
                    }
                });
            });
        }

        response_200(res, objectArr);
    } catch (error) {
        response_500(res, "Error getting objects", error);
    }
};

exports.getObject = async (req, res) => {
    try {
        const object = await Objects.findById(req.params.id);
        const similarObject = await Objects.find({
            groupBy: object.groupBy,
        }).select("accoName logo isUpcomming");
        response_200(res, { object, similarObject });
    } catch (error) {
        response_500(res, "Error getting object", error);
    }
};

exports.getObjectByLabel = async (req, res) => {
    try {
        // console.log(req.user)
        const objects = await Objects.find({
            labels: {
                $in: [req.params.label],
            },
        }).select("name logo description tagLine labels");

        const objectArray = objects.map((object) => {
            return {
                ...object._doc,
                isBookmarked: false,
            };
        });

        if (req.user) {
            const user = await User.findById(req.user._id);
            const bookmarks = user.bookmarks.map((bookmark) =>
                bookmark.toString()
            );
            console.log(bookmarks);
            objectArray.forEach((object) => {
                if (bookmarks.includes(object._id.toString())) {
                    object.isBookmarked = true;
                }
            });
        }
        response_200(res, objectArray);
    } catch (error) {
        response_500(res, "Error getting objects by label", error);
    }
};

exports.getResponseOfObject = async (req, res) => {
    try {
        const object = await Objects.findById(req.params.id);
        const groups = req.body.groups;
        console.log(groups);
        let prompt = "";
        for (let i = 0; i < object.groups.length; i++) {
            for (let j = 0; j < object.groups[i].length; j++) {
                prompt +=
                    object.groups[i][j].gpt.replace("{%%}", groups[i][j]) + " ";
            }
        }
        console.log("prompt", prompt);

        try {
<<<<<<< HEAD
            prompt += ` generate entire output as json string, like this eg: {output:"<div><p>line 1<br/>line2 and so on ... </div>"}, including all texts also.`;
=======
            prompt += ` i want output like this {output:"<div><p>line 1<br/>line2 and so on ... </div>"} as json string and nothing else in the output. just return html output and no feedback`;
>>>>>>> b771cc896ca4cdc8801940e1f4230867b1df4b45
            console.log(prompt);
        } catch (error) {
            console.log(error);
        }

        if (!req.user) return response_400(res, "User not found");

        const user = await User.findById(req.user._id);

        const response = await generateResponse(prompt);
        // const response = { test: "test" };
        await user.descreseLimit();
        res.status(200).json({
            status: "success",
            message: "Response generated successfully",
            data: response,
            prompt: prompt,
        });
        // response_200(res, response);
    } catch (error) {
        response_500(res, "Error getting response of object", error);
    }
};

exports.getCategories = async (req, res) => {
    try {
        const objects = await Objects.find();
        const categories = [];
        objects.forEach((object) => {
            for (let i = 0; i < object.labels.length; i++) {
                if (!categories.includes(object.labels[i]))
                    categories.push(object.labels[i]);
            }
        });
        response_200(res, categories);
    } catch (error) {
        response_500(res, "Error getting categories", error);
    }
};

exports.searchObjects = async (req, res) => {
    try {
        const objects = await Objects.find({
            name: {
                $regex: req.params.query,
                $options: "i",
            },
        }).select("name logo description tagLine labels isUpcomming");
        response_200(res, objects);
    } catch (error) {
        response_500(res, "Error searching objects", error);
    }
};

exports.updateObject = async (req, res) => {
    try {
        const object = await Objects.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        response_200(res, object);
    } catch (error) {
        response_500(res, "Error updating object", error);
    }
};
