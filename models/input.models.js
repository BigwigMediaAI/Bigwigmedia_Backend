const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const inputSchema = new Schema({
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
    
});


const Input = mongoose.model("Input", inputSchema);

module.exports = Input;