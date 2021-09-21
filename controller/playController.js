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
        usersLiked: [],
        author: req.userId || 123
    })

    try {

        const play = await newPlay.save()

        console.log(play, Date.now)

    } catch (error) {

        return error

    }
}

const getAllPlays = async (req, res) => {

    return await Play.find().lean()
}

const getSinglePlay = async (req, res) => {
    const id = req.params.id;

    try {

        return await Play.findById(id).lean();

    } catch (err) {

        return err

    }
}

const likePlay = async (req, res) => {
    
    const id = req.params.id
    const userId = req.userId

    try{
        return await Play.findByIdAndUpdate(id, {$push: {usersLiked: userId}})
    }catch(err){
        return err
    }
}

module.exports = {
    createPlay,
    getAllPlays,
    getSinglePlay,
    likePlay
}
