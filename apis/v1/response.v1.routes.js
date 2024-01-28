const { getResponse } = require("../../controllers/response.controllers");

const router = require("express").Router();

router.post("/", getResponse);

module.exports = router;
