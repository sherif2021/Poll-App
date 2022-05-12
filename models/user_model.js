const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    education: { type: String, required: true },
    profession: { type: String, required: true },
    city: { type: String, required: true },
    password: { type: String, required: true },
    picture: { type: String, default: '' },
    fcmToken: { type: String, default: '' },
    language: { type: String, default: 'en' },

}, { versionKey: false, timestamps: true, })

module.exports = mongoose.model("users", userSchema);