const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const postRouter = require('./controllers/postRouter')
const userRouter = require('./controllers/userRouter')
const loginRouter = require('./controllers/login')

const app = express()

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => {
		logger.info('Successful connection to MongoDB')
	})
	.catch(error => {
		logger.error('Failed connection with error: ', error.message)
	})



app.use(express.json())
app.use(morgan('tiny'))
app.use(middleware.getAuthorization)
app.use(middleware.doNothing)

app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)

module.exports = app