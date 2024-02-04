const Templete = require("../models/templetes.models");
const User = require("../models/users.models");
const generatePrompt = require("../utils.js/generatePrompt.utils");
const generateResponse = require("../utils.js/generateResponse.utils");
const removeEmoji = require("../utils.js/removeEmoji");
const removeHashtag = require("../utils.js/removeHashtag");
const {
    response_500,
    response_200,
} = require("../utils.js/responseCodes.utils");

exports.getResponse = async (req, res) => {
    try {
        
        const prompt = req.body.prompt;
        const tone = req.body.tone;
        const useEmoji = (req.body.useEmoji);
        const useHashTags = (req.body.useHashTags);
        const templateId = req.body.templateId;
        const template = await Templete.findById(templateId);
        console.log(req.body);
        
        // get user from req.user
        const user = await User.findById(req.user._id);

        // decrease limits
        await user.descreseLimit();
        console.log(user)
        console.log(template)

        // generate prompt
        const generatedPrompt = generatePrompt(
            template.templete,
            prompt,
            tone,
            useEmoji === "true" ? true : false,
            useHashTags=== "true" ? true : false
        );
        console.log(generatedPrompt);


        let response = await generateResponse(generatedPrompt);
        console.log(response);
        if(useEmoji!== "true"){
            response = removeEmoji(response);
        }

        if(useHashTags!== "true"){
            response = removeHashtag(response);
        }

        response_200(res, "Response generated successfully", response);
    } catch (error) {
        response_500(res, "Error getting response", error);
    }
};
