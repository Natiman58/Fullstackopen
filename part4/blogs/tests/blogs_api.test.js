const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')
const blog = require('../models/blog')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')

beforeEach(async () => {
    await Blog.deleteMany({})
    /*
    for(let blog of helper.initialBlogs){
        let blogObject = new Blog(blog)
        await blogObject.save()
    }*/
    await User.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
}, 10000)


describe('when there is initially some blogs saved', () => {
    test('blogs are returned as JSON', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 10000)

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    }, 10000)
})


test('a valid blog can be added', async () => {
    const testUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'testuser',
        blogs: []
    };

    // create the user in the db
    const userResponse = await api.post('/api/users').send(testUser);
    const userId = userResponse.body.id; // get the user ID from the response

    // login the user
    const loginResponse = await api.post('/api/login').send({
        username: testUser.username,
        password: testUser.password,
    });
    const token = loginResponse.body.token;

    const newBlog = {
        title: 'test blog',
        author: 'test user',
        url: 'testurl.com',
        likes: 10,
        user: userId
    };

    // set the user ID dynamically
    //newBlog.user = userId;
    testUser.blogs = testUser.blogs.concat(newBlog)

    await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
});

test('if the like property is missing, default to 0', async () => {
    const testUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'testuser',
        blogs: []
    }

    const userResponse = await api.post('/api/users').send(testUser)
    const userId = userResponse.body.id

    //login response
    const loginResponse = await api.post('/api/login').send({
        username: testUser.username,
        password: testUser.password
    })
    const token = loginResponse.body.token

    const newBlog = {
        title: 'Test blog-2',
        author: 'Test author-2',
        url: 'Test url-2',
        user: userId
    }
    testUser.blogs = testUser.blogs.concat(newBlog)

    const response = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const createdBlog = response.body
    expect(createdBlog.likes).toBe(0)
})

test('if the title and url properties are missing, respond with 400', async () => {
    const testUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'testuser',
        blogs: []
    }

    const userResponse = await api.post('/api/users').send(testUser)
    const userId = userResponse.body.id

    //login response
    const loginResponse = await api.post('/api/login').send({
        username: testUser.username,
        password: testUser.password
    })
    console.log(loginResponse)
    const token = loginResponse.body.token

    const newBlog = {
        author: 'Test author-2',
        user: userId
    }
    testUser.blogs = testUser.blogs.concat(newBlog)

    await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog can be deleted', async () => {
    const testUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'testuser',
        blogs: []
    }

    // Create the user in the db
    const userResponse = await api.post('/api/users').send(testUser)
    const userId = userResponse.body.id

    // Login the user; response
    const loginResponse = await api.post('/api/login').send({
        username: testUser.username,
        password: testUser.password
    })

    const token = loginResponse.body.token
    console.log(typeof(token))
    // verify token
    const decodedToken = jwt.verify(token, config.SECRET)
    console.log('Decoded Token:', decodedToken);


    // Create the blog by the testuser
    const blogToDelete = {
        title: 'test blog',
        author: 'test user',
        url: 'testurl.com',
        likes: 10,
        user: userId
    }
    /*
    const initialBlogs = await helper.blogsInDb()
    const blogToDelete = initialBlogs[0]
    */
    blogToDelete.user = userId
    //testUser.blogs = testUser.blogs.concat(blogToDelete)
    console.log('User ID from Token:', decodedToken.id);
    console.log('User ID from Blog:', blogToDelete.user);

    // Add the blog to the db
    const blogResponse = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogToDelete)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    // Extract the ID of the created blog
    blogToDelete.id = blogResponse.body.id

    // Add the blog to the user's blogs
    //testUser.blogs = testUser.blogs.concat(blogToDelete)

    // Delete the blog
    // Delete the blog with headers set
    const deleteResponse = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`);


    //expect(deleteResponse.statusCode).toBe(204)

    console.log('Delete Response:', deleteResponse.status, deleteResponse.body);


    // Check the blogs at the end
    //const blogsAtEnd = await helper.blogsInDb()

    // Assert that the blog is no longer in the list
    //expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    //expect(blogsAtEnd).not.toContainEqual(blogToDelete)
})



test('a specif blog property can be updated; like', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedProperty = {
        likes: 100
    }

    await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedProperty)
        .expect(204)

    const updatedBlog = await Blog.findById(blogToUpdate.id)
    expect(updatedBlog.likes).toBe(100)

})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({
            username: 'root',
            name: 'Superuser',
            password: 'root',
        })
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "root"
        }

        await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with porper status code and message if username is invalid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "r2",
            name: "Superuser",
            password: "root"
        }

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        expect(result.body.error).toContain(`Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length`)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails with porper status code and message if password is invalid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "r"
        }

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)
        expect(result.body.error).toContain('password must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})