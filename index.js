require('dotenv').config()

const env = process.env.NODE_ENV

console.log(env)

const app = require('express')()
require('./config/express')(app)

const mongoose = require('mongoose')

const config = require('./config/config')
const { isLoggedIn } = require('./controller/authController')
const { getAllPlays } = require('./controller/playController')
const play = require('./model/play')

mongoose.connect(config[env].dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.error(err)
      throw err
    }

    //Here is home route
    app.get('/', isLoggedIn, async (req, res) => {

      const sortByLikes = req.query.sort;

      const plays = (await getAllPlays())
        .filter(e => e.isPublic === true)
        .sort((a,b) => a.createdAt - b.createdAt)
      
        sortByLikes === 'likes' ? plays.sort((a,b) => b.usersLiked.length - a.usersLiked.length) : true
        sortByLikes === 'date' ? plays.sort((a,b) =>  b.createdAt - a.createdAt) : true
       
        res.render('home', {
            title: 'Home page',
            isLoggedIn: req.isLoggedIn,
            plays
        })
    })

    app.listen(config[env].port, console.log(`Database and Server is up and running on port ${config[env].port}`))
  }) 

