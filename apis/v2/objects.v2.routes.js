const router = require("express").Router();
const {
    addInput,
    addGroup,
    addObject,
    addObjectOnce,
    getObject,
    getObjectByLabel,
    getObjects,
    getResponseOfObject,
    getCategories
} = require("../../controllers/addObjects.controllers");
const { checkLimit } = require("../../middleware/limitCheck.middleware");
const { auth } = require("../../middleware/auth.middleware");

router.post("/addInput", addInput);
router.post("/addGroup", addGroup);
router.post("/addObject", addObject);
router.post("/addObjectOnce", addObjectOnce);
router.get("/getObjects", getObjects);
router.get("/getObject/:id", getObject);
router.get("/getObjectByLabel/:label", getObjectByLabel);

router.post("/getResponseOfObject/:id", auth, checkLimit, getResponseOfObject);

router.get("/getCategories", getCategories);

module.exports = router;