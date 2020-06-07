const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
	const body = request.body
	
	const user = await User.findOne({username: body.username})
	let passwordCorrect
	
	if (!user)
		passwordCorrect = false
	else
		passwordCorrect = await bcrypt.compare(body.password, user.passwordHash)
	
	if (!user || !passwordCorrect)
		return response.status(422).json({error: 'invalid username or password'})
	
	
	const payload = {
		username: user.username,
		id: user._id
	}
	const token = jwt.sign(payload, process.env.SECRET)
	
	response.status(200).json({
		token,
		name: user.name,
		id: user.toJSON().id
	})
})


module.exports = loginRouter