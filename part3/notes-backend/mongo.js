const mongoose = require('mongoose')

if (process.argv.legth<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://natiman58:${password}@cluster0.wkn6iy5.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })

  const Note = mongoose.model('Note', noteSchema)

  const note1 = new Note({
    content: 'HTML is Easy',
    important: true
  });

  const note2 = new Note({
    content: 'Browser can execute only JavaScript',
    important: false
  });

  const note3 = new Note({
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  });

  Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    //mongoose.connection.close()
})
note1.save();
note2.save()
note3.save()

console.log('notes saved!')
