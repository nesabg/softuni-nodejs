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

    } catch (e){

        return {
            error: true,
            message: e.message
        }
    }
}

const getAllPlays = async (req, res) => {

    try {

        return await Play.find().lean()

    } catch(e) {

        return {
            error: true,
            message: e.message
        }
    }
}

const getSinglePlay = async (req, res) => {

    const id = req.params.id;

    try {

        return await Play.findById(id).lean();

    } catch (e) {

        return {   
            error: true,
            message: e.message
        }

    }
}

const likePlay = async (req, res) => {
    
    const id = req.params.id
    const userId = req.userId

    try {
        return await Play.findByIdAndUpdate(id, {$push: {usersLiked: userId}})
    } catch(e) {
        return {
            error: true,
            message: e.message
        }
    }
}

const deletePlay = async (req, res) => {

    const id = req.params.id

    try {
        await Play.findByIdAndDelete(id)
    } catch(e) {
        console.error(e)
    }
}

module.exports = {
    createPlay,
    getAllPlays,
    getSinglePlay,
    likePlay,
    deletePlay
}
