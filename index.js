const app = require('express')()
require('./config/express')(app)

const mongoose = require('mongoose')

const config = require('./config/config');



mongoose.connect(config.dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.error(err)
      throw err
    }

    //Here is home route
    app.get('/', (req, res) => {
        res.render('home', {
            title: 'Home page',
            loggedIn: true
        })
    })

    app.listen(config.port, console.log(`Database and Server is up and running on port ${config.port}`))
  }) 

