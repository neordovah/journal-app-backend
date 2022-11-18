const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    text: String
})

module.exports = mongoose.model("Note", noteSchema)

