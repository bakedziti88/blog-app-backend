const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
		
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	}
})

commentSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})


commentSchema.pre('deleteOne', { document: true, query: false}, async function(next) {
	
	//If your two models depend on each other (i.e., requires each other at the top), there will be issues
	//Instead, require the post where necessary, like right here
	//Look up node circular dependencies for more info
	const Post = require('./Post')
	
	const post = await Post.findById(this.post)
	
	post.comments = post.comments.filter(c => c.toString() !== this._id.toString())
	await post.save()
})

module.exports = mongoose.model('Comment', commentSchema)