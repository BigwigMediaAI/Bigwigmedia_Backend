const Razorpay=require("razorpay")
const {OrderModel}=require("../models/order.model")
const crypto=require("crypto")
const User = require("../models/users.models");
const plan=require("../enums/plan.enums")
const token=require("../models/token.model")
require("dotenv").config()


const callBackApi = async (req, res) => {
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature}=req.body
     
    const body_data=razorpay_order_id+"|"+razorpay_payment_id
    const expect=crypto.createHmac('sha256',process.env.RAZORPAY_SECRET_KEY)
    .update(body_data).digest('hex');
    const isvalid= expect===razorpay_signature;
    if(!isvalid){
      return res.status(401).json({msg:"Invalid Signature"})
    }else{
      // in the else part i need to do
      const user = await User.findById(req.user.clerkId)
      console.log(user)
      if(user){
        await token.addPlanDirectBuy(plan);
        await OrderModel.savePaymentDetails(req.clerkId, razorpay_order_id , razorpay_payment_id );
        res.send({ msg: "Payment Successful!", status : true });
      }else{
        res.status(401).send({msg:"Payment Failed!"});
      }



    }
    
    try{
        let order=await OrderModel.findOne({"razorpay_order_id":razorpay_order_id},{
          $set:{
            razorpay_payment_id,razorpay_order_id,razorpay_signature
          }
        });
        
        if (!order) {
            const newOrder= await OrderModel.create({
                "user_id":"User",
                "product_id":"Product",
                "quantity":1,
                "price":order.amount,
                "totalPrice":399,
                "razorpay_order_id":razorpay_order_id,
                "razorpay_payment_id":razorpay_payment_id
            })
             return res.status(200).json(newOrder);
        }else{
          return res.status(400).send("This Order already exists");
        }
        }catch(err){
           console.log(err)
           return res.status(500).json({error: err}); 
           }
  
  
  }
module.exports={callBackApi}