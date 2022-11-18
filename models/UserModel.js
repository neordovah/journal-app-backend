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
    },
    todos: {
        type: Array,
        default: []
    },
    logs: {
        type: Object,
        default: {}
    },
    notes: {
        type: Array,
        default: []
    },
    events: {
        type: Object,
        default: {}
    }
})

module.exports = mongoose.model("User", userSchema)