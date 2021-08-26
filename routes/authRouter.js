const express = require('express')

const router = express.Router()

router.get('/login', (req, res) => {

    res.render('auth/login', {
        title: 'Login page | Sofuni Nodejs'
    })

})

router.get('/register', (req, res) => {

    res.render('auth/register', {
        title: 'Login page | Sofuni Nodejs'
    })
    
})

module.exports = router