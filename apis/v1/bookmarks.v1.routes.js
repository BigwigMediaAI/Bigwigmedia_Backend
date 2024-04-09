const {
    addOrRemoveBookmark,
    getBookmarks,
} = require("../../controllers/bookmarks.controllers");
const { auth } = require("../../middleware/auth.middleware");

const router = require("express").Router();

router.post("/add-remove/:id", addOrRemoveBookmark);
router.get("/", getBookmarks);

module.exports = router;
