const { getAllUserData, addCreditM } = require("../../controllers/admin.controllers");
const { adminAuth } = require("../../middleware/adminAuth.middleware");

const router = require("express").Router();

// router.get("/all", adminAuth, getAllUserData);          // for production uncomment this
router.get("/all", getAllUserData);                         // for testing
router.post("/addCreditManual", addCreditM)

module.exports = router;