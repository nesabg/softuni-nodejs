const express = require('express')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')


// Adding routes

const authRouter = require('../routes/authRouter')
const playRouter = require('../routes/playRouter')

module.exports = (app) => {
    app.use(cookieParser())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.engine('.hbs', handlebars({
      extname: '.hbs'
    }))
    
    app.set('view engine', '.hbs');
  
    app.use('/static', express.static('static'))

    app.use(compression())
    // app.use(helmet())

    app.use(authRouter)
    app.use(playRouter)
  };