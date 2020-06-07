//The main index of the page. This is the outermost layer, and we create a new server using the app we developed in app.js

const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
	logger.info(`Server is running on port ${config.PORT}`)
})