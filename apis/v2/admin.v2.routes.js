const {
    getAllUserData,
    addCreditM,
    searchUser,
} = require("../../controllers/admin.controllers");
const { adminAuth } = require("../../middleware/adminAuth.middleware");

const router = require("express").Router();

// router.get("/all", adminAuth, getAllUserData);          // for production uncomment this
router.get("/all", getAllUserData); // for testing
router.post("/addCreditManual", addCreditM);
router.get("/search", searchUser);

module.exports = router;
