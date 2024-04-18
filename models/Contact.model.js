const moongoose=require("mongoose")

const ContactSchema=new moongoose.Schema({
    name: { type: String, required: true },
    email:{type:String},
    message:{type:String}
})


const ContactModel=moongoose.model("contact",ContactSchema)

module.exports=ContactModel