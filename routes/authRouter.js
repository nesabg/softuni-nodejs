const express = require('express')
const router = express.Router()

const { saveUser, getUser, guestAccess, isAuth } = require('../controller/authController')


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






module.exports = router