const router = require("express").Router();
const {
    addInput,
    addGroup,
    addObject,
    addObjectOnce,
    getObject,
    getObjectByLabel,
    getObjects
} = require("../../controllers/addObjects.controllers");

router.post("/addInput", addInput);
router.post("/addGroup", addGroup);
router.post("/addObject", addObject);
router.post("/addObjectOnce", addObjectOnce);
router.get("/getObjects", getObjects);
router.get("/getObject/:id", getObject);
router.get("/getObjectByLabel/:label", getObjectByLabel);

module.exports = router;
