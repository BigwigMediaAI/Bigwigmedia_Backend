const {
    getAllPlans,
    getPlanHistory,
    getCurrentPlan,
} = require("../../controllers/plans.controllers");
const { auth } = require("../../middleware/auth.middleware");

const router = require("express").Router();

router.get("/", getAllPlans);
router.get("/history", auth, getPlanHistory);
router.get("/current", auth, getCurrentPlan);

module.exports = router;
