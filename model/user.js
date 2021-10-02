const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    bio: {
        type: String,
        required: true,
        minlength: 50,
        maxlength: 2000
    },
    likedPlays: [{
        type: 'ObjectId',
        ref: 'Play'
    }]
})

module.exports = mongoose.model('User', UserSchema)