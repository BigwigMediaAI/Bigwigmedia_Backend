const { getAllPlans } = require("../../controllers/plans.controllers");

const router = require("express").Router();

router.get("/", getAllPlans);

module.exports = router;