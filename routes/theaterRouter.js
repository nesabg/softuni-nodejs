const express = require('express')

const { isLoggedIn, isAuth } = require('../controller/authController')
const { createPlay } = require('../controller/playController')

const router = express.Router()

router.get('/theater', isLoggedIn, (req, res) => {

    res.render('theater/single', {
        title: 'Single Theater | Sofuni Nodejs'
    })

})

router.get('/edit-theater', isLoggedIn, (req, res) => {

    res.render('theater/edit', {
        title: 'Edit Theater | Sofuni Nodejs'
    })

})

router.get('/create-play', isLoggedIn, isAuth, (req, res) => {

    res.render('theater/create', {
        title: 'Create Theater | Sofuni Nodejs',
        isLoggedIn: req.isLoggedIn
    })
    
})

router.post('/create-play', isLoggedIn, isAuth, async (req, res) => {

    const error  = await createPlay(req, res)

    if(error){
        const message = error.code === 11000 ? 'The title is already taken' : 'All fields are required or description length must be 50 characters'
        
        res.render('theater/create', {
            isLoggedIn: req.isLoggedIn,
            title: error.code,
            error: true,
            message
        })
    }else {
        res.redirect('/')
    }

    
})


module.exports = router