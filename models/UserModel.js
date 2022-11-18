const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User must be provided"]
    },
    username: {
        type: String,
        required: [true, "Username must be provided"]
    },
    password: {
        type: String,
        required: [true, "Password must be provided"]
    }
})

module.exports = mongoose.model("User", userSchema)