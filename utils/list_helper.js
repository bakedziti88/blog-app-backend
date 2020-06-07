const dummy = (posts) => {
	return 1
}

const totalLikes = (posts) => {
	const reducer = (accumulator, post) => {
		return accumulator + post.likes
	}
	const initial_value = 0
	
	return posts.reduce(reducer, 0)
}

const favoritePost = (posts) => {
	const reducer = (mostLikedPost, post) => {
		return mostLikedPost.likes > post.likes ? mostLikedPost : post
	}
	return posts.reduce(reducer, posts[0])
}

module.exports = {
	dummy,
	totalLikes,
	favoritePost
}