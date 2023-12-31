const dummy = (blogs) => {
    return blogs.length === 0 ? 1 : blogs.length
}

const totalLikes = (blogs) => {
        return blogs.map(blog => blog.likes).reduce((sum, likes) => sum + likes, 0)
    }

const favoriteBlog = (blogs) => {
    // return the blog with maximum likes
    const maxLikes = blogs.reduce((max, blog) => Math.max(max, blog.likes), 0)
    const favorite = blogs.find(blog => blog.likes === maxLikes)

    return favorite
}

module.exports = { dummy, totalLikes, favoriteBlog }