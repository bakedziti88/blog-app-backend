const mongoose = require('mongoose')
const Comment = require('./Comment')
const User = require('./User')

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	body: {
		type: String,
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	last_edited: {
		type: Date
	},
	likes: {
		type: Number,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	}]
})

//DO NOT USE ARROW FUNCTIONS!!! this OBJECT WILL NOT BE INHEIRTED
postSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	
	await Comment.deleteMany({post: this._id})
	
	const user = await User.findById(this.user)
	user.posts = user.posts.filter(p => p.toString() !== this._id.toString())
	await user.save()
	
	next()
})

postSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Post', postSchema)