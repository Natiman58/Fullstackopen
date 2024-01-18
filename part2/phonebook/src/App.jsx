import { useState, useEffect } from 'react'
import Note from './components/Note.jsx'
import Notification from './components/Notification.jsx'
import axios from 'axios'
import contacts from './services/contacts.jsx'
import './index.css'

const Persons = ({persons, setPersons}) => {
  return (
    <div>
      {persons.map(person =>
        <p key={person.name}>
          {person.name} {person.number}
          <button onClick={() => {
            const confirmed = window.confirm(`Delete ${person.name}?`);
            if (confirmed) {
              const personId = person.id;
              const existingPerson = persons.find(person => person.id === personId);
              if(existingPerson) {
                contacts.deleteContact(personId).then(response => {
                  setPersons(persons.filter(person => person.id !== personId))
                })
              }
            }
          }}>
            delete
          </button>
        </p>
      )}
    </div>
  )
}

const PersonForm = ({addNewPerson, newName, handleChange, newNum, handleNumChange}) => {
  return (
    <form onSubmit={addNewPerson}>
    <div> name: <input value={newName} onChange={handleChange} /> </div>
    <div>number: <input value={newNum} onChange={handleNumChange}/></div>
    <div> <button type="submit">add</button> </div>
    </form>
  )
}

const Filter = ({filter, handleFilter, setPersons, persons}) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={handleFilter} />
    </div>
  )

}




const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('added someone')
  const [type, setType] = useState(null)

  useEffect(() => {
    console.log('effect')
    contacts.getAll().then(initilContacts => setPersons(initilContacts))
  }, [])


  const addNewPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      const confirmed = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);
      if (confirmed) {
        const updatedPerson = { ...existingPerson, number: newNum }
        contacts.update(existingPerson.id, updatedPerson).then(returnedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
          setMessage(`Updated ${returnedPerson.name} successuflly!`)
          setTimeout(()=> {setMessage(null)}, 5000)
          setType('success')
        }).catch(error => {
          //setMessage(`Information of ${existingPerson.name} has already been removed from server`)
          setMessage(error.response.data.error)
          setTimeout(()=> {setMessage(null)}, 5000)
          setType('error')
        });
        setNewName('')
        setNewNum('')
      }
    } else {
      const newPerson = { name: newName, number: newNum }
      contacts.create(newPerson).then(createdContact => {
        setPersons(persons.concat(createdContact))
        setNewName('')
        setNewNum('')

        setMessage(`Added ${createdContact.name} successuflly!`)
        setType('success')
        setTimeout(()=> {setMessage(null)}, 5000)
      })
      .catch (error => {
        setMessage(error.response.data.error)
        setType('error')
        setTimeout(()=> {setMessage(null)}, 5000)
        console.log(`Error creating : ${error.response.data.error}`)
      })
    }
  }

  const handleChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumChange = (event) => {
    setNewNum(event.target.value)
  }

  const handleFilter = (event) => {
    const newQuery = event.target.value
    setFilter(newQuery)
    if (newQuery === '') {
      setPersons(contacts.getAll().then(initilContacts => setPersons(initilContacts)))
    }
    setPersons(persons.filter(person => person.name.toLowerCase().startsWith(filter.toLowerCase())))
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={type} />
      <Filter filter={filter} handleFilter={handleFilter} setPersons={setPersons} persons={persons} />
      <h3>add a new</h3>
      <PersonForm addNewPerson={addNewPerson} newName={newName} handleChange={handleChange} newNum={newNum} handleNumChange={handleNumChange}/>
      <h2>Numbers</h2>
      <Persons persons={(persons)} setPersons={setPersons}/>
    </div>
  )
}

export default App