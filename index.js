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

    //Here is routes

    app.get('/', (req, res) => {
        res.send('Hello World')
    })
    
    app.listen(config.port, console.log(`Database and Server is up and running on port ${config.port}`))
  }) 

