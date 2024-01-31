const {
    searchTemplete,
    getTemplete,
    addTemplate,
    getLabels,
    getTempletesByLabel,
    getAllTemplates,
    updateTemplate,
} = require("../../controllers/templetes.controllers");

const router = require("express").Router();

router.get("/", getAllTemplates);
router.get("/search", searchTemplete);
router.get("/get/:id", getTemplete);
router.post("/add", addTemplate);
router.get("/labels", getLabels);
router.get("/label/:label", getTempletesByLabel);
router.post("/update/:id", updateTemplate);
module.exports = router;
