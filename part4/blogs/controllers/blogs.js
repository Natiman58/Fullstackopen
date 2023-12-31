const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const config = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})
/*
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer')){
    return authorization.replace('Bearer ', '')
  }
  return null
}*/
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = new Blog(request.body)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid'})
  }
  //const user = await User.findById(decodedToken.id)
  const userId = request.user
  const user = await User.findById(userId)

  if (!user) {
    return response.status(401).json({ error: 'user not found'})
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid'})
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({error: 'blog not found'})
  }
  const userId = request.user

  if (blog.user.toString() !== userId.toString()) {
    return response.status(401).json({ error: 'user not authorized to delete this blog'})
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedProperty = {
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedProperty, {new: true})
  response.status(204).json(updatedBlog)
})

module.exports = blogsRouter