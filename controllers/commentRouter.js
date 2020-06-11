const mongoose = require('mongoose')
const commentRouter = require('express').Router({mergeParams: true})

const Post = require('../models/Post')
const Comment = require('../models/Comment')

const middleware = require('../utils/middleware')

commentRouter.get('/', async (request, response, next) => {
	
	const comments = await Comment.find( {post: request.params.id} )
	response.json({comments: comments.map(c => c.toJSON())})
	
})

commentRouter.get('/:cid', async (request, response, next) => {
	try {
		const comment = await Comment.findById(request.params.cid)
		response.json(comment.toJSON())
	}
	catch (e) {
		next(e)
	}
})

commentRouter.post('/', async (request, response, next) => {
	
	//TODO: Expand validation
	if (!request.body.name || !request.body.body) {
		response.status(403).send({error: 'missing fields (i.e. content/name are empty'})
	}
	
	const parentPost = await Post.findById(request.params.id)
	
	const comment = new Comment({
		name: request.body.name,
		body: request.body.body,
		post: request.params.id
	})
	
	try {
		const savedComment = await comment.save()
		
		parentPost.comments = parentPost.comments.concat(savedComment)
		await parentPost.save()
		
		response.status(201).json({comment})
	}
	catch (e) {
		next(e)
	}
})

//TODO implement these functions as you would imagine them


//It appears there is no hook for deleteMany in mongoose
//Therefore we have to do manual cascade deletion right here to save time/resources
commentRouter.delete('/', async (request, response) => {
	const parentId = request.params.id
	
	await Comment.deleteMany({post: parentId})
	
	const parentPost = await Post.findById(parentId)
	parentPost.comments = []
	await parentPost.save()
	
	response.status(204).end()
})


//This triggers middleware fine
commentRouter.delete('/:cid', async (request, response) => {
	const cid = request.params.cid
	const comment = await Comment.findById(cid)
	await comment.deleteOne()
	response.status(204).end()
})

//Not sure yet if this functionality will be allowed
/*

commentRouter.put('/:id', async(request, response) => {
	
})
*/

module.exports = commentRouter