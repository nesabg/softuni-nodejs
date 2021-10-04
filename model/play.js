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
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        required: true
    },
    usersLiked: [{
        type: 'ObjectId',
        ref: 'User'
    }],
    author: {
        type: String,
        required: true
    },
    playViews: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Play', PlaySchema)