const { getResponse } = require('../../controllers/response.controllers');

const router = require('express').Router();

router.get('/', getResponse);

module.exports = router;