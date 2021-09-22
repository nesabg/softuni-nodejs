const app = require('express')()
require('./config/express')(app)

const mongoose = require('mongoose')

const config = require('./config/config')
const { isLoggedIn } = require('./controller/authController')
const { getAllPlays } = require('./controller/playController')
const play = require('./model/play')

mongoose.connect(config.dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.error(err)
      throw err
    }

    //Here is home route
    app.get('/', isLoggedIn, async (req, res) => {

      const plays = (await getAllPlays())
        .filter(e => e.isPublic === true)
        .sort((a,b) => b.createdAt - a.createdAt)
      
        res.render('home', {
            title: 'Home page',
            isLoggedIn: req.isLoggedIn,
            plays
        })
    })

    app.listen(config.port, console.log(`Database and Server is up and running on port ${config.port}`))
  }) 

