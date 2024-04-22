const mongoose=require("mongoose");

const FeedbackSchema=mongoose.Schema({
  name:{
    type:String,
    required: true
  },
  email:{
    type:String,
    required: true
  },
  tool: {
    type: String,
    required: true
  },
  date:{
    type:Date,
    default:Date.now
  },
  review:{
    type:String,
    required: true
    },
})
const FeedbackModel=mongoose.model("Feedback",FeedbackSchema);

module.exports=FeedbackModel;