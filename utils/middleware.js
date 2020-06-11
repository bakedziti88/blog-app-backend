const Post = require('../models/Post')

const unknownEndpoint = (request, response) => {
	response.status(404).send({error: 'Unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
	if (error.name === 'CastError')
	{
		response.status(400).send({error: 'Malformed ID'})
	}
	else if (error.name === 'ValidationError')
	{
		response.status(400).json({error: error.message})
	}
	else if (error.name === 'JsonWebTokenError')
	{
		response.status(400).json({error: 'malformed web token'})
	}
	next(error)
}

const getAuthorization = (request, response, next) => {
	const token = request.get('authorization')
	if (token && token.toLowerCase().startsWith('bearer '))
	{
		request.token = token.substring(7)
	}
	
	next()
}

const doNothing = (request, response, next) => {
	console.log('Middleware active')
	next()
}

const validatePost = async (request, response, next) => {
	try {
		console.log(request.params.id)
		const post = await Post.findById(request.params.id)
	}
	catch(e) {
		console.log(e.message)
		return response.status(404).json({error: 'Post does not exist'})
	}
	next()
}

module.exports = {unknownEndpoint, errorHandler, getAuthorization, doNothing, validatePost}