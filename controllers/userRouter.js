const userRouter = require('express').Router()
const User = require('../models/User')

const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('posts', {title: 1})
	response.json(users.map(user => user.toJSON()))
})

userRouter.get('/:id', async (request, response) => {
	const user = await User.findById(request.params.id).populate('posts', {title: 1})
	response.json(user.toJSON())
})

userRouter.post('/', async (request, response) => {
	const body = request.body
	const errors = validate(body)
	
	if (errors.length > 0)
		return response.status(403).json(errors)
		
	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)
	
	const [first, last] = body.name.split(' ')
	
	const newUser = new User({
		username: body.username,
		passwordHash,
		name: {
			first,
			last
		}
	})
	
	try {
		const savedUser = await newUser.save()
		response.status(201).json(savedUser.toJSON())
	} catch (e) {
		console.log(e.response)
		response.status(403).json({error: 'unsure, check server logs'})
	}
})

const validate = (body) => {
	let errors = []
	if (!body.username)
	{
		errors.push({error: 'missing username'})
	}
	else if (body.username.length < 3)
	{
		errors.push({error: 'username must be at least 3 characters'})
	}
	if (!body.password)
	{
		errors.push({error: 'missing password'})
	}
	else if (body.password.length < 3)
	{
		errors.push({error: 'password must be at least 3 characters'})
	}
	
	const splitName = body.name.split(' ')
	if (splitName.length !== 2) {
		errors.push({error: 'only use a first and last name, no middle names. 2 words only'})
	}
	return errors
}

module.exports = userRouter