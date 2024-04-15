const Razorpay=require("razorpay")
const {OrderModel}=require("../models/order.model")
const crypto=require("crypto")
require("dotenv").config()

const Razorpay_Instance=new  Razorpay({
    key_id:process.env.RAZORPAY_LIVE_KEY,
    key_secret:process.env.RAZORPAY_SECRET_KEY
})

const createOrder = async (req, res) => {
  const {name,amount}=req.body
      const order=await Razorpay_Instance.orders.create({
      amount:Number(amount*100),
      currency:"INR",
      receipt:"receipt_no_"+Math.floor(Date.now()),
    })

  await OrderModel.create({
    order_id:order.id,
    name:name,
    amount:amount
  })

  console.log({order})
  res.status(200).json({order})

}



module.exports={createOrder}
