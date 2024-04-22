const router=require("express").Router()
const {getAllFeedback,Postfeedback}=require("../../controllers/feedback.controller")


router.get("/allfeedback",getAllFeedback)
router.post("/add-feedback",Postfeedback);

module.exports = router;
