const listHelper = require('../utils/list_helper')

describe('find the most liked post, call it favorite post. theoretically can be more than one but we just going to return one', () => {
	
	const blogList = [
		{
			title: 'Test blog',
			_id: '329438429834',
			author: 'David Test',
			url: 'charanko.org',
			__v: 0,
			likes: 4
		},
		{
			title: 'Test blog',
			_id: '329438429834',
			author: 'David Test',
			url: 'charanko.org',
			__v: 0,
			likes: 17
		},
		{
			title: 'Test blog',
			_id: '329438429834',
			author: 'David Test',
			url: 'charanko.org',
			__v: 0,
			likes: 3
		},
		{
			title: 'Test blog',
			_id: '329438429834',
			author: 'David Test',
			url: 'charanko.org',
			__v: 0,
			likes: 1
		},
	]
	
	test('most: ', () => {
		const result = listHelper.favoritePost(blogList)
		
		expect(result.likes).toBe(17)
	})
})