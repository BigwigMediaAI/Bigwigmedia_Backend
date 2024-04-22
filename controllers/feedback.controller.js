const FeedbackModel=require("../models/Feedback.model");
const {
    response_500,
    response_200,
} =require("../utils.js/responseCodes.utils")

exports.Postfeedback=async(req,res)=>{
    try {
    const {name,email,review}=req.body;
    const data=new FeedbackModel({name,email,review})
    await data.save()
    response_200(res,"Your response added successfully ",data)
    } catch (error) {
        res.status(401).send("error in  adding feedback "+ error);
    }
}

exports.getAllFeedback=async(req,res)=>{
    try {
        const data=await FeedbackModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).send('Error In  Fetching Data')
    }
}

