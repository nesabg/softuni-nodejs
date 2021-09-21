const mongoose = require('mongoose')

const PlaySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 50,
    },
    imageUrl: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        required: true
    },
    usersLiked: {
        type: Array
    },
    author: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Play', PlaySchema)