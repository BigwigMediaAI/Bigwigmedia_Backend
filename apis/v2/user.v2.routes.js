const router = require('express').Router();

const { getAllUser, editUser } = require('../controllers/user.controllers');

router.get('/get/all', getAllUser);
router.put('/edit', editUser);

module.exports = router;