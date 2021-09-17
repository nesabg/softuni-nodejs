const mongoose = require('mongoose')

const Play = require('../model/play')

const createPlay = async (req, res) => {
    const { title, description, imageUrl, isPublic } = req.body

    const newPlay = Play({
        title,
        description,
        imageUrl,
        isPublic: isPublic == undefined ? false : true,
        createdAt: Date.now(),
        usersLiked: []
    })

    try{

        await newPlay.save()

    }catch(error){

        return error
        
    }
}

module.exports = {
    createPlay
}
