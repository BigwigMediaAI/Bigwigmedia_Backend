const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    inputs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Input",
        },
    ],
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;