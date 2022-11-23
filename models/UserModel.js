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
    dailyLogs: {
        type: Array,
        default: []
    },
    logs: {
        type: Array,
        default: [Object]
    },
    notes: {
        type: Array,
        default: []
    },
    events: {
        type: Array,
        default: []
    },
    habits: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model("User", userSchema)