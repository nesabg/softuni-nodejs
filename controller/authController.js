const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/config')


const User = require('../model/user')

const saveUser = async (req, res) => {

    const {
        username,
        password,
        rePassword
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
            password: hashedPass
        })

        const savedUser = await newUser.save()

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
        }, config.secretKey)

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
        jwt.verify(token, config.secretKey)
        req.isLoggedIn = true
        next()
    } catch(err) {
        req.isLoggedIn = false
        res.redirect('/')
    }

}

const isLoggedIn = (req, res, next) => {
    const token = req.cookies['auth'];

    if(!token){
        req.isLoggedIn = false
    }

    try{
        jwt.verify(token, config.secretKey, (err, data) => {
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
    guestAccess
}