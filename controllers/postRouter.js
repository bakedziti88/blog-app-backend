const postRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

const Post = require('../models/Post')
const User = require('../models/User')

postRouter.get('/', async (request, response) => {
	const posts = await Post.find({}).populate('user', {username: 1, id: 1})
	response.json(posts.map(post => post.toJSON()))
})

postRouter.get('/:id', (request, response, next) => {
	Post.findById(request.params.id).populate('user', {username: 1, id: 1}).then(result => {
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
		author: body.author,
		url: body.url,
		user: decoded.id,
		likes: 0
	})
	
	let savedPost = await post.save()
	user.posts = user.posts.concat(savedPost)
	await user.save()
	response.status(201).json(savedPost.toJSON())
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
	
	await Post.findByIdAndDelete(request.params.id)
	response.status(204).end()
})

postRouter.put('/:id', async (request, response) => {
	const token = request.token
	
	if (!token)
	{
		return response.status(401).json({error: 'unauthorized access'})
	}
	
	const post = await Post.findByIdAndUpdate(request.params.id, {likes: request.body.likes}, {new: true}).populate('user', {username: 1, id: 1})
	response.json(post.toJSON())
})

module.exports = postRouter