const router = require("express").Router();
const {PostData,GetData}=require("../../controllers/contact.controllers")


router.post("/form",PostData)
router.get("/getdata",GetData)


module.exports = router;
