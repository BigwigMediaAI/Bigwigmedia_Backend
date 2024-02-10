const mongoose = require("mongoose");
const Templete = require("./templetes.models");

require("dotenv").config();

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    clerkId: { type: String, required: true },
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Object",
        },
    ],
    current_limit: {
        type: Number,
        default: process.env.INITIAL_LIMIT,
    },
    max_limit: {
        type: Number,
        default: process.env.INITIAL_LIMIT,
    },
});

usersSchema.methods.descreseLimit = function () {
    this.current_limit = this.current_limit - 1;
    return this.save();
};

usersSchema.methods.getLimits = function () {
    return {
        current_limit: this.current_limit,
        max_limit: this.max_limit,
    };
};

usersSchema.methods.increaseLimit = function (increment) {
    this.current_limit = this.current_limit + increment;
    this.max_limit = this.max_limit + increment;
    return this.save();
}

usersSchema.methods.removeBookmark = function (templeteId) {
    const updatedBookmarks = this.bookmarks.filter((t) => {
        return t.toString() !== templeteId.toString();
    });
    this.bookmarks = updatedBookmarks;
    return this.save();
};

usersSchema.methods.addOrRemoveBookmark = function (templeteId) {
    const templeteIndex = this.bookmarks.findIndex((t) => {
        return t.toString() === templeteId.toString();
    });
    const updatedBookmarks = [...this.bookmarks];
    if (templeteIndex >= 0) {
        updatedBookmarks.splice(templeteIndex, 1);
    } else {
        updatedBookmarks.push(templeteId);
    }
    this.bookmarks = updatedBookmarks;
    return this.save();
};

// usersSchema.methods.getBookmarks =  async function () {
//     let x = await this.bookmarks.map(async (bookmarkId) => {
//         console.log(bookmarkId)
//         const bookmark = await Templete.findById(bookmarkId).select(
//             "name logo description labels"
//         );
//         // console.log(bookmark);
//         return bookmark;
//     });
//     console.log(x);
//     return x;
// };

usersSchema.methods.isBookedMarked = function (templeteId) {
    return (
        this.bookmarks.findIndex((t) => {
            return t.toString() === templeteId.toString();
        }) >= 0
    );
};

const Users = mongoose.model("User", usersSchema);

module.exports = Users;
