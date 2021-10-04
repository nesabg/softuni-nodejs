const express = require('express')
const router = express.Router()

const { saveUser, getUser, guestAccess, isAuth, isLoggedIn, getUserInfo, editUserProfile } = require('../controller/authController')
const user = require('../model/user')


router.get('/login', guestAccess, (req, res) => {

    res.render('auth/login', {
        pageTitle: 'Login page | Sofuni Nodejs'
    })

})

router.post('/login', async (req, res) => {

    const error = await getUser(req, res)
    
    if(error) {
        res.render('auth/login', {
            pageTitle: `Error | ${error.message}`,
            error,
            message: error.message
        })
    }else{
        res.redirect('/')    
    }

})


router.get('/register', guestAccess, (req, res) => {

    res.render('auth/register', {
        pageTitle: 'Login page | Sofuni Nodejs'
    })
    
})

router.post('/register', async (req, res) => {

    const error = await saveUser(req, res)

    if(error) {
        res.render('auth/register', {
            pageTitle: `Error | ${error.message}`,
            error,
            message: error.message.code === 11000 ? 'Username already exist' : error.message
        })
    }else{
        res.redirect('/login')    
    }

})

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth')
        
    res.redirect('/')
})

router.get('/user-profile', isLoggedIn, isAuth, async (req, res) => {

    const user = await getUserInfo(req, res)

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }

    const lastLoginDate = user.lastLoginDate.slice(-2)[0].toLocaleDateString('bg-BG', options)

    const lastLoginIp = user.lastLoginIp.slice(-2)[0]

    res.render('auth/profile', {
        pageTitle: `Profile page of ${user.fullName}`,
        isLoggedIn: req.isLoggedIn,
        ...user,
        lastLoginDate,
        lastLoginIp
    })
})

router.get('/user-edit/:id', isLoggedIn, isAuth, async (req, res) => {
    
    if(req.userId !== req.params.id) {
        res.redirect('/')
    }

    const user = await getUserInfo(req, res)

    res.render('auth/edit', {
        pageTitle: `Edit profile of user ${user.fullName}`,
        isLoggedIn: req.isLoggedIn,
        ...user
    })
})

router.post('/user-edit/:id', async (req, res) => {

    const error = await editUserProfile(req, res)

    if(error.message) {
        res.render('auth/edit', {
            pageTitle: `Error | ${error.message}`,
            error,
            message: error.message.code === 11000 ? 'Username already exist' : error.message
        })
    }else{
        res.redirect('/user-profile')    
    }

})


module.exports = router