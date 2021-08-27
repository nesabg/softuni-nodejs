const express = require('express')
const router = express.Router()

const { saveUser, getUser, isAuth } = require('../controller/authController')


router.get('/login', (req, res) => {

    res.render('auth/login', {
        title: 'Login page | Sofuni Nodejs'
    })

})

router.post('/login', async (req, res) => {

    const error = await getUser(req, res)

    if(error) {
        res.render('auth/login', {
            title: `Error | ${error.message}`,
            error,
            message: error.message
        })
    }else{
        res.redirect('/')    
    }

})


router.get('/register', (req, res) => {

    res.render('auth/register', {
        title: 'Login page | Sofuni Nodejs'
    })
    
})

router.post('/register', async (req, res) => {

    const error = await saveUser(req, res)

    if(error) {
        res.render('auth/register', {
            title: `Error | ${error.message}`,
            error,
            message: error.message
        })
    }else{
        res.redirect('/login')    
    }

})

router.get('/logout', (req, res) => {
    res.clearCookie('auth')
        
    res.redirect('/')
})






module.exports = router