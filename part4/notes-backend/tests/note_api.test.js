const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const helper = require('./test_helper')


const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
	/*
    await Note.deleteMany({})

    let noteObject = new Note(helper.initialNotes[0])
    await noteObject.save()

    noteObject = new Note(helper.initialNotes[1])
    await noteObject.save()
    */
	await Note.deleteMany({})
	/*
    for(let note of helper.initialNotes){
        let noteObject = new Note(note)
        await noteObject.save()
    }*/
	await Note.insertMany(helper.initialNotes)
}, 10000)

const api = supertest(app)

describe('when there is initially some notes saved', () => {
	test('notes are returned as json', async () => {
		await api.get('/api/notes')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	}, 10000)

	test('all notes are returned', async () => {
		const response = await api.get('/api/notes')
		expect(response.body).toHaveLength(helper.initialNotes.length)
	})

	test('a specific note is within the returned notes', async () => {
		const response = await api.get('/api/notes')
		const contents = response.body.map(r => r.content)
		expect(contents).toContain('Browser can execute only JavaScript')
	})
})

describe('viewing a specific note', () => {
	test('succeeds with a valid id', async () => {
		const nptesAtStart = await helper.notesInDb()
		const noteToView = nptesAtStart[0]

		const resultNote = await api
			.get(`/api/notes/${noteToView.id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(resultNote.body).toEqual(noteToView)
	})

	test('fails with statuscode 404 if note doesnt exist', async () => {
		const validNoneexistingId = await helper.nonExistingId()

		await api
			.get(`/api/notes/${validNoneexistingId}`)
			.expect(404)
	})

	test('fails ith statuscode 400 if id is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.get(`/api/notes/${invalidId}`)
			.expect(400)
	})
})

describe('addition of a new note', () => {
	test('succeeds with valid data', async () => {
		const newNote = {
			content: 'async/await simplifies making async calls',
			important: true,
		}
		await api.post('/api/notes')
			.send(newNote)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const notesAtEnd = await helper.notesInDb()
		expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
		const contents = notesAtEnd.map(n => n.content)
		/*
        const response = await api.get('/api/notes')
        const contents = response.body.map(r => r.content)

        expect(response.body).toHaveLength(initialNotes.length + 1)
        */
		expect(contents).toContain('async/await simplifies making async calls')
	})

	test('fails with status code 400 if data invalid', async () => {
		const newNote = {
			important: true
		}
		await api
			.post('/api/notes')
			.send(newNote)
			.expect(400)

		const notesAtEnd = await helper.notesInDb()
		//const response = await api.get('/api/notes')
		expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
	})
})

describe('deletion of a note', () => {
	test('succeeds with status code 204 if id is valid', async () => {
		const notesAtStart = await helper.notesInDb()
		const noteToDelete = notesAtStart[0]

		await api
			.delete(`/api/notes/${noteToDelete.id}`)
			.expect(204)
		const notesAtEnd = await helper.notesInDb()

		expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)
		expect(notesAtEnd).not.toContain(noteToDelete)
	})
})

describe('when there is initally one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash('sekret', 10)
		const user = new User({ username: 'root', passwordHash })
		await user.save()
	})

	test('creation succeeds with a fresh username', async () => {
		const userAtStart = await helper.userInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-type', /application\/json/)
		const userAtEnd = await helper.userInDb()
		expect(userAtEnd).toHaveLength(userAtStart.length + 1)

		const usernames = usersAtEnd.map(u => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const userAtStart = await helper.userInDb()

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-type', /application\/json/)

		expect(result.body.error).toContain('expected `username` to be unique')

		const usersAtEnd = await helper.userInDb()
		expect(usersAtEnd).toEqual(userAtStart)
	})
})




afterAll(async () => {
	await mongoose.connection.close()
})