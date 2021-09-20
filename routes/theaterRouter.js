const express = require('express')

const { isLoggedIn, isAuth } = require('../controller/authController')
const { createPlay, getSinglePlay, likePlay } = require('../controller/playController')

const router = express.Router()

router.get('/play/:id', isLoggedIn, async (req, res) => {
    
    const data = await getSinglePlay(req, res)

    const userLiked = [...data.usersLiked].toLocaleString().includes(req.userId)

    res.render('theater/single', {
        pageTitle: 'Single Theater | Sofuni Nodejs',
        isLoggedIn: req.isLoggedIn,
        userLiked,
        ...data
    })

})

router.get('/like/:id', isLoggedIn, async (req, res) => {
    
    await likePlay(req, res)

    res.redirect(`/play/${req.params.id}`)

})

router.get('/edit-theater', isLoggedIn, (req, res) => {

    res.render('theater/edit', {
        pageTitle: 'Edit Theater | Sofuni Nodejs'
    })

})

router.get('/create-play', isLoggedIn, isAuth, (req, res) => {

    res.render('theater/create', {
        pageTitle: 'Create Theater | Sofuni Nodejs',
        isLoggedIn: req.isLoggedIn
    })
    
})

router.post('/create-play', isLoggedIn, isAuth, async (req, res) => {

    const error  = await createPlay(req, res)

    if(error){
        const message = error.code === 11000 ? 'The title is already taken' : 'All fields are required or description length must be 50 characters'
        
        res.render('theater/create', {
            isLoggedIn: req.isLoggedIn,
            pageTitle: error.code,
            error: true,
            message
        })
    }else {
        res.redirect('/')
    }

    
})


module.exports = router