const router = require("express").Router();
const {PostData}=require("../../controllers/contact.controllers")


router.post("/form",PostData)


module.exports = router;
