const listHelper = require('../utils/list_helper')

test('returns one', () => {
	const posts = []
	
	const result = listHelper.dummy(posts)
	
	expect(result).toBe(1)
})

