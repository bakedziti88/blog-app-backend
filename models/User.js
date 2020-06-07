const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		first: String,
		last: String
	},
	passwordHash: String,
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
		}
	]
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject.passwordHash
		delete returnedObject.__v
		delete returnedObject._id
	}
})

userSchema.plugin(uniqueValidator, {message: 'username already taken'})

module.exports = mongoose.model('User', userSchema)