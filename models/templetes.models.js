const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const templetesSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    templete: {
        type: String,
        required: true,
    },
    labels: [
        {
            type: String,
        },
    ],
    logo: {
        type: String,
    },
});

const Templetes = mongoose.model("Templete", templetesSchema);

module.exports = Templetes;
