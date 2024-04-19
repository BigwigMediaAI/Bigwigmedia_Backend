const ContactSchema=require("../models/Contact.model")
const {
    response_500,
    response_200,
} =require("../utils.js/responseCodes.utils")



exports.GetData=async(req,res)=>{
    try {
        const data=await ContactSchema.find()
        if(!data){
            res.status(401).json({msg:"data not found"})
        }else{
            res.status(200).json(data)
        }
    } catch (error) {
        console.log(error)
    }
}

exports.PostData=async(req,res)=>{
    try {
        const {name,email,message}=req.body;
        const data=new ContactSchema({name,email,message})
        await data.save();
        response_200(res, "data added successfully", data);
 } catch (error) {
     res.status(401).send(error)
     console.log(error.message)
    }
}