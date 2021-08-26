const express = require('express')

const router = express.Router()

router.get('/theater', (req, res) => {

    res.render('theater/single', {
        title: 'Single Theater | Sofuni Nodejs'
    })

})

router.get('/edit-theater', (req, res) => {

    res.render('theater/edit', {
        title: 'Edit Theater | Sofuni Nodejs'
    })

})

router.get('/theater-create', (req, res) => {

    res.render('theater/create', {
        title: 'Create Theater | Sofuni Nodejs'
    })
    
})

module.exports = router