const app = require('express')()
require('./config/express')(app)

const mongoose = require('mongoose')

const config = require('./config/config');
const { isAuth, isLoggedIn } = require('./controller/authController');



mongoose.connect(config.dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.error(err)
      throw err
    }

    //Here is home route
    app.get('/', isLoggedIn, (req, res) => {
        res.render('home', {
            title: 'Home page',
            isLoggedIn: req.isLoggedIn
        })
    })

    app.listen(config.port, console.log(`Database and Server is up and running on port ${config.port}`))
  }) 

