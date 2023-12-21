const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// To serve the static file of the frontend
app.use(express.static('dist'));
app.use(express.json());

var morgan = require('morgan')
morgan.token('req-body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

const Contact = require('./models/contact')
/*
let notes = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]*/

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => response.json(contacts))
})


app.get('/info', (request, response) => {
    const date = new Date();
    //console.log(Contact)
    //response.send(`<p>Phonebook has info for {$size "$Contact"} people</p><p>${date}</p>`)
    Contact.countDocuments({})
    .then(count => {
        response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
    })
    .catch(error => {
        response.status(500).json({error: "Error in counting documents"});
    })
});

app.get('/api/persons/:id', (request, response, next) => {
    /*
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if(note){
        response.json(note)
    }
    response.status(404).end()
    */
   Contact.findById(request.params.id)
   .then(contact => {
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
   })
   .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    //const id = Number(request.params.id)
    //notes = notes.filter(note => note.id !== id)
    //response.status(204).end()

    Contact.findByIdAndDelete(request.params.id)
   .then(result => {response.status(204).end()})
   .catch(error => next(error))
})
/*
const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}*/

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    /*
    if(!body.name || !body.number){
        return response.status(400).json({error: 'content missing' })
    }
     else if (notes.find(note => note.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }*/

    const person = new Contact({
        name: body.name,
        number: body.number,
        //id: generateId()
    })

    //notes = notes.concat(person)
    //response.json(person)
    /*const validationError = person.validateSync()
    if(validationError){
        response.status(400).json({ error: validationError.message });
    }*/
    person.validate()
    .then(() => person.save())
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    /*const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }*/
    const { name, number } = request.body

    Contact.findByIdAndUpdate(
        request.params.id,
        {name, number},
        {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError' ){
        return response.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});