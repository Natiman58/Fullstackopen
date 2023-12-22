// NNotes-backend/index.js
require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

// middlewares
app.use(express.static('dist'))
app.use(express.json())


// middleware to handle requests with unknown endpoint
const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}
app.use(requestLogger)

// The note module that handles the database connection and the schema model
const Note = require('./models/note')
/*
let notes = [
	{
		id: 1,
		content: 'HTML is easy',
		important: true
	},
	{
		id: 2,
		content: 'Browser can execute only JavaScript',
		important: false
	},
	{
		id: 3,
		content: 'GET and POST are the most important methods of HTTP protocol',
		important: true
	}
]*/

app.get('/', (request, response) => {
	response.send('<h1>Hello Worldö!</h1>')
})

app.get('/api/notes', (request, response) => {
	Note.find({}).then(notes => console.log(notes) || response.json(notes))
})

app.get('/api/notes/:id', (request, response, next) => {
	Note.findById(request.params.id)
		.then(note => {
			if(note) {
				response.json(note)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => {
			console.log(error)
			next(error)
			//response.status(400).send({ error: 'malformatted id' })
		})
})



app.delete('/api/notes/:id', (request, response, next) => {
	//const id = Number(request.params.id)
	//notes = notes.filter(note => note.id !== id)

	Note.findByIdAndDelete(request.params.id)
		.then(() => {response.status(204).end()})
		.catch(error => next(error))
})

/*
const generateId = () => {
	const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
	return maxId + 1
}*/

app.post('/api/notes', (request, response, next) => {
	const body = request.body

	const note = new Note({
		content: body.content,
		important: body.important || false,
		//id: generateId(),
	})

	//notes = notes.concat(not)
	//response.json(note)
	note.save()
		.then(savedNote => {
			response.json(savedNote)
		})
		.catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
	/*const body = request.body
  const note = {
    content: body.content,
    important: body.important,
  }*/

	const { content, important } = request.body

	Note.findByIdAndUpdate(
		request.params.id,
		{ content, important },
		{ new: true, runValidators: true, context: 'query' })
		.then(updatedNote => {
			response.json(updatedNote)
		})
		.catch(error => next(error))
})

const unknownEndPoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
	console.log(error.message)
	if (error.name === 'CastError'){
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError'){
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

// handler of requests with result to errors and has to be loaded last
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})