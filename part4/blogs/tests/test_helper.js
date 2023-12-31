const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const initialBlogs = [
    {
        "title": "test blog",
        "author": "testuser",
        "url": "testuser.com",
        "likes": 56,
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const getToken = async (userId) => {
    const token = jwt.sign(userId, config.SECRET)
    return token
}

module.exports = { initialBlogs, nonExistingId, blogsInDb, usersInDb, getToken }