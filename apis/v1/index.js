const router = require("express").Router();
const templatesRoutes = require("./templates.v1.routes");
const responseRoutes = require("./response.v1.routes");
const { auth } = require("../../middleware/auth.middleware");
const bookmarksRoutes = require("./bookmarks.v1.routes");

router.get("/", (req, res) => {
    res.send("API LIVE!");
});
router.use("/templates", auth, templatesRoutes);
router.use("/response", auth, responseRoutes);
router.use("/bookmarks", auth, bookmarksRoutes);

module.exports = router;
