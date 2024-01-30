const User = require("../models/users.models");
const Templete = require("../models/templetes.models");
const { response_500, response_400, response_401, response_200 } = require("../utils.js/responseCodes.utils");

exports.addOrRemoveBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);
        const user = await User.findById(req.user._id);
        const templete = await Templete.findById(id);
        if (!templete) {
            return response_401(res, "Templete not found");
        }
        await user.addOrRemoveBookmark(templete._id);
        response_200(res, "Bookmark added", user.bookmarks);       
    } catch (error) {
        response_500(res, "Error adding bookmark", error);
    }
}

exports.removeBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        const templete = await Templete.findById(id);
        if (!templete) {
            return response_401(res, "Templete not found");
        }
        await user.removeBookmark(templete._id);
        response_200(res, "Bookmark removed", templete);
    } catch (error) {
        response_500(res, "Error removing bookmark", error);       
    }
}

exports.getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const bookmarks = user.bookmarks;
        const allBookmarks = [];
        for(let i = 0; i < bookmarks.length; i++) {
            const bookmark = await Templete.findById(bookmarks[i]).select(
                "name logo description labels"
            );
            allBookmarks.push(bookmark);
        }

        response_200(res, "Bookmarks found", allBookmarks);
    } catch (error) {
        response_500(res, "Error getting bookmarks", error);
    }
}

