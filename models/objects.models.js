const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const objectsSchema = new Schema({
    name: { type: String, required: true },
    accoName: { type: String, required: true },
    description: { type: String, default: ""},
    groups: [
        [
            {
                text: { type: String, required: true },
                placeholder: { type: String },
                gpt: { type: String },
                type: { type: String, required: true },
                options: [
                    {
                        type: String,
                    },
                ],
                required: { type: Boolean },
            },
        ],
    ],
    labels: [
        {
            type: String,
        },
    ],
    groupBy: {
        type: String,
        required: true,
        default: "All Tools",
    },
    logo: {
        type: String,
        required: true,
    },
    accoLogo: {
        type: String,
        required: true,
    },
    faq: [
        {
            question: { type: String },
            answer: { type: String },
        },
    ],
});

const Objects = mongoose.model("Object", objectsSchema);

module.exports = Objects;
