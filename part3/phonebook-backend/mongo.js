const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3];
const number = process.argv[4]


const url = `mongodb+srv://natiman58:${password}@cluster0.wkn6iy5.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Phonebook = mongoose.model('Phonebook', phoneBookSchema)


const contact = new Phonebook({
    name: name,
    number: number
})

if (process.argv.length === 3){
    console.log('phonebook:')
    Phonebook.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        //mongoose.connection.close()
    })
}

/*
contact.save().then(result => {
    console.log('contact saved!')
    mongoose.connection.close()
})*/
