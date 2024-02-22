const router = require("express").Router();

const {
    getLimit,
    decreaseLimit,
    increaseLimit,
} = require("../../controllers/limits.controllers");

router.get("/", getLimit);
router.post("/decrease", decreaseLimit);
router.post("/increase", increaseLimit);

module.exports = router;
