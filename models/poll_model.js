const mongoose = require('mongoose')


const pollSchema = new mongoose.Schema({
    title_en: { type: String, required: true },
    title_ur: { type: String, required: true },
    sub_title_en: { type: String, required: true },
    sub_title_ur: { type: String, required: true },
    options: { type: Array, required: true },
    duration: { type: Number, required: true },

}, { versionKey: false, timestamps: true, })

module.exports = mongoose.model("polls", pollSchema);