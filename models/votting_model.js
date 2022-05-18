const mongoose = require('mongoose')


const votesSchema = new mongoose.Schema({
    poll_id: { type: String, required: true },
    user_id: { type: String, required: true },
    value: { type: Number, required: true },
    comment: { type: String, default: '' },
    video: { type: String, default: '' },

}, { versionKey: false, timestamps: true, })

module.exports = mongoose.model("votes", votesSchema);