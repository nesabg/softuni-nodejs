const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const env = process.env.NODE_ENV


const User = require('../model/user')

const saveUser = async (req, res) => {

    const {
        username,
        password,
        rePassword,
        email,
        fullName,
        bio,
        avatar
    } = req.body;

    if(password.length < 8 || password !== rePassword){
        return {
            error: true,
            message: password.length < 8 ? 'Password must be longer than 8 characters' : 'Passwords did`t match'
        }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    try {
        const newUser = User({
            username,
            password: hashedPass,
            email,
            fullName,
            avatar,
            bio,
            lastLoginIp: [],
            lastLoginDate: []
        })

        const savedUser = await newUser.save()

    } catch(err) {
        return {
            error: true,
            message: err
        }
    }

}

const editUserProfile = async (req, res) => {

    const id = req.params.id

    const {
        username,
        password,
        rePassword,
        email,
        fullName,
        bio,
        avatar
    } = req.body;

    if(password.length < 8 || password !== rePassword){
        return {
            error: true,
            message: password.length < 8 ? 'Password must be longer than 8 characters' : 'Passwords did`t match'
        }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    try {
       
        return await User.findByIdAndUpdate(id, {
            username,
            email,
            fullName,
            avatar,
            password: hashedPass,
            bio
        })

    } catch(err) {
        return {
            error: true,
            message: err
        }
    }
}

const getUser = async (req, res) => {
    const {
        username, 
        password
    } = req.body

    const currentUser = await User.findOne({username})

    if(!currentUser){
        return {
            error: true,
            message: 'User or Password are incorrect'
        }
    }

    const status = await bcrypt.compare(password, currentUser.password)

    if(status){
        const token = await jwt.sign({
            username: currentUser.username,
            id: currentUser._id
        }, process.env.SECRET)

        const lastLoginIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const lastLoginDate = new Date()

        const data = await User.findByIdAndUpdate(currentUser._id, { $push: {lastLoginDate, lastLoginIp} })
                
      console.log(data);
        res.cookie('auth', token)

    }else {
        return {
            error: true,
            message: 'User or Password are incorrect'
        }
    }
}

const isAuth = (req, res, next) => {
    const token = req.cookies['auth'];

    if(!token){
        req.isLoggedIn = false
        res.redirect('/')
    }

    try{
        jwt.verify(token, process.env.SECRET)
        req.isLoggedIn = true
        next()
    } catch(err) {
        req.isLoggedIn = false
        res.redirect('/')
    }

}

const getUserInfo = async (req, res) => {
    const id = req.userId

    try {
        return await User.findById(id).populate('likedPlays').lean()
    } catch(e) {
        console.error(e)
    }
}

const isLoggedIn = (req, res, next) => {
    const token = req.cookies['auth'];

    if(!token){
        req.isLoggedIn = false
    }

    try{
        jwt.verify(token, process.env.SECRET, (err, data) => {
            req.userId = data.id
        })
 
        req.isLoggedIn = true

    } catch(err) {
        req.isLoggedIn = false
    }

    next()
}

const guestAccess = (req, res, next) => {
    const token = req.cookies['auth']

    if (token) {
      return res.redirect('/')
    }
    next()
  }

module.exports = {
    saveUser,
    getUser,
    isAuth,
    isLoggedIn,
    guestAccess,
    getUserInfo,
    editUserProfile
}