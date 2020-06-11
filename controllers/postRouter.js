const postRouter = require('express').Router()
const commentRouter = require('./commentRouter')

const jwt = require('jsonwebtoken')

const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

const Post = require('../models/Post')
const User = require('../models/User')

postRouter.use('/:id', middleware.validatePost)
postRouter.use('/:id/comments', commentRouter)

postRouter.get('/', async (request, response) => {
	const posts = await Post.find({}).populate('user', {username: 1, id: 1, name: 1})
		.populate('comments')
	response.json(posts.map(post => post.toJSON()))
})

postRouter.get('/:id', (request, response, next) => {
	Post.findById(request.params.id).populate('user', {username: 1, id: 1}).populate('comments').then(result => {
		if (result)
		{
			response.json(result.toJSON())
		}
		else
		{
			response.status(404).end()
		}
	})
	.catch(error => next(error))
})

postRouter.post('/', async (request, response, next) => {
	const body = request.body
	
	const token = request.token
	if (!token)
	{
		return response.status(401).json({error: 'unauthorized creation of post'})
	}
	
	const decoded = jwt.verify(token, process.env.SECRET)
	
	if (!decoded || !decoded.id) {
		return response.status(401).json({error: 'invalid or missing token'})
	}
	 
	const user = await User.findById(decoded.id)
	
	const post = new Post({
		title: body.title,
		body: body.body,
		user: decoded.id,
		last_edited: null,
		likes: 0
	})
	
	try {
		const savedPost = await post.save()
		user.posts = user.posts.concat(savedPost)
		await user.save()
		response.status(201).json(savedPost.toJSON())
	}
	catch (e) {
		next(e)
	}
})

postRouter.delete('/:id', async (request, response) => {
	const token = request.token
	if (!token)
	{
		return response.status(401).json({error: 'unauthorized access - not logged in'})
	}
	
	const decodedToken = jwt.verify(token, process.env.SECRET)
	
	const post = await Post.findById(request.params.id)
	if (!post)
	{
		return response.status(404).json({error: 'not found'})
	}
	
	const userIdFromPost = post.user.toString()
	
	if (userIdFromPost !== decodedToken.id)
	{
		return response.status(401).json({error: 'unauthorized access'})
	}
	
	await post.deleteOne()
	response.status(204).end()
})


//Designate this route solely for post editng, liking posts will be at a different route, see under this
postRouter.put('/:id', async (request, response, next) => {
	const token = request.token
	
	if (!token)
	{
		return response.status(401).json({error: 'unauthorized access'})
	}
	
	const decodedToken = jwt.verify(token, process.env.SECRET)
	
	const post = await Post.findById(request.params.id)
	if (post.user.toString() !== decodedToken.id) {
		return response.status(401).json({error: 'unauthorized access to edit this post'})
	}
	
	try {
		const savedPost = await Post.findOneAndReplace(request.params.id, {title: request.body.title, body: request.body.body}, {new: true})
		console.log(savedPost)
		response.status(200).json(savedPost.toJSON())
	}
	catch (e) {
		console.log(e.message)
		next(e)
	}
})

postRouter.put('/:id/like', async (request,response, next) => {
	const post = await Post.findByIdAndUpdate(request.params.id, {likes: request.body.likes}, {new: true})
		.populate('user', {username: 1, id: 1, name: 1}).populate('comments')
	response.json(post.toJSON())
})

module.exports = postRouter