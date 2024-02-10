const {
    response_500,
    response_201,
    response_200,
} = require("../utils.js/responseCodes.utils");
const Objects = require("../models/objects.models");
const Group = require("../models/group.models");
const Input = require("../models/input.models");
const generateResponse = require("../utils.js/generateResponse.utils");

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
            groups,
            labels,
            logo,
            accoLogo,
            faq,
        } = req.body;
        console.log(req.body);
        const newObject = new Objects({
            name,
            accoName,
            description,
            tagLine,
            groups,
            labels,
            logo,
            accoLogo,
            faq,
        });
        await newObject.save();
        console.log(newObject);

        response_201(res, newObject);
    } catch (error) {
        response_500(res, "Error adding object", error);
    }
};

exports.getObjects = async (req, res) => {
    try {
        const objects = await Objects.find().select("name logo description tagLine");
        response_200(res, objects);
    } catch (error) {
        response_500(res, "Error getting objects", error);
    }
};

exports.getObject = async (req, res) => {
    try {
        const object = await Objects.findById(req.params.id);
        const similarObject = await Objects.find({
            groupBy: object.groupBy,
        }).select("accoName logo");
        response_200(res, { object, similarObject });
    } catch (error) {
        response_500(res, "Error getting object", error);
    }
};

exports.getObjectByLabel = async (req, res) => {
    try {
        const objects = await Objects.find({
            labels: {
                $in: [req.params.label],
            },
        }).select("name logo description tagLine");
        response_200(res, objects);
    } catch (error) {
        response_500(res, "Error getting objects by label", error);
    }
};

exports.getResponseOfObject = async (req, res) => {
    try {
        const object = await Objects.findById(req.params.id);
        const groups = req.body.groups;
        let prompt = "";
        console.log(object.groups);
        for (let i = 0; i < object.groups.length; i++) {
            for (let j = 0; j < object.groups[i].length; j++) {
                prompt +=
                    object.groups[i][j].gpt.replace("{%%}", groups[i][j]) + " ";
            }
        }

        console.log(prompt);
        const response = await generateResponse(prompt);
        console.log(response);

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
                categories.push(object.labels[i]);
            }
        });
        response_200(res, categories);
    } catch (error) {
        response_500(res, "Error getting categories", error);
    }
};
