const express = require('express')

const { isLoggedIn, isAuth } = require('../controller/authController')
const { createPlay, getSinglePlay, likePlay, deletePlay, editPlay } = require('../controller/playController')

const router = express.Router()

router.get('/play/:id', isLoggedIn, async (req, res) => {

    const currentUser = req.userId
    
    const data = await getSinglePlay(req, res)

    const isUserLiked = [...data.usersLiked].toLocaleString().includes(currentUser)

    res.render('theater/single', {
        pageTitle: 'Single Theater | Sofuni Nodejs',
        isLoggedIn: req.isLoggedIn,
        isUserLiked,
        isAuthor: currentUser === data.author,
        ...data
    })

})

router.get('/like/:id', isLoggedIn, async (req, res) => {
    
    await likePlay(req, res)

    res.redirect(`/play/${req.params.id}`)

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

router.get('/edit-play/:id', isLoggedIn, isAuth, async (req, res) => {

    const currentPlay = await getSinglePlay(req, res)

    res.render('theater/edit', {
        pageTitle: 'Create Theater | Sofuni Nodejs',
        isLoggedIn: req.isLoggedIn,
        ...currentPlay
    })
    
})

router.post('/edit-play/:id', isLoggedIn, isAuth, async (req, res) => {

    const error = await editPlay(req, res)

    if(error.message){
        const message = error.code === 11000 ? 'The title is already taken' : 'All fields are required or description length must be 50 characters'
        
        res.render('theater/edit', {
            isLoggedIn: req.isLoggedIn,
            pageTitle: error.code,
            error: true,
            message
        })
    }else {
        res.redirect(`/play/${req.params.id}`)
    }

    
})

router.get('/delete/:id', isLoggedIn, isAuth, async (req, res) => {

    const play = await getSinglePlay(req, res)

    if(play.author !== req.userId){
        return res.redirect(`/play/${req.params.id}`)
    }

    await deletePlay(req, res)

    res.status(200).redirect('/')
    
})


module.exports = router