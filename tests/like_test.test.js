const listHelper = require('../utils/list_helper')

describe('total likes', () => {
	const blogList = [
		{
			title: 'Test blog',
			_id: '329438429834',
			author: 'David Test',
			url: 'charanko.org',
			__v: 0,
			likes: 6
		}
	]
	
	test('list of one should return total likes, 6', () => {
		const result = listHelper.totalLikes(blogList)
		
		expect(result).toBe(blogList[0].likes)
	})
})