import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personServices from './services/persons';
import Notification from './components/Notification';
 

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personServices.getAll()
     .then( initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addPerson = (event) => {
    console.log("Adding person...")
    event.preventDefault()
    if(!persons.some((person) => person.name === newName)){
      const personObject = {
        name: newName,
        number: newNumber
      }
      console.log("Adding non-duplicate person...", newName)

      personServices.create(personObject)
        .then( returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          const messageObject = {
            text: `Person '${returnedPerson.name}' has been succesfully added to the phonebook`,
            type: 'success'
          }
          setMessage(messageObject)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      }).catch(error => {
        console.log("Caught error")
        const messageObject = {
          text: error.response.data.error,
          type: 'error'
        }
        setMessage(messageObject)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        console.log(messageObject.text)
      })
      
      
    } else if(!persons.some((person) => person.number === newNumber)){      
      if(window.confirm(`${newName} is already added to the phonebook. Are you sure you want to update the number?`)){
        const toUpdate = persons.find((person) => person.name === newName)
        const updatedPerson = {...toUpdate, number: newNumber}

        personServices.update(updatedPerson.id, updatedPerson)
          .then( returnedPerson => {
              setPersons(persons.map((person) => person.id === updatedPerson.id ? returnedPerson : person))
              setNewName('')
              setNewNumber('')
              const messageObject = {
                text: `Person '${returnedPerson.name}' has been succesfully updated in the phonebook`,
                type: 'success'
              }
              setMessage(messageObject)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            }
          )
          .catch(error => {
            /* const messageObject = {
              text: `Information of '${updatedPerson.name}' has already been removed from the phonebook`,
              type: 'error'
            }
            setMessage(messageObject)
            setTimeout(() => {
              setMessage(null)
            }, 5000)*/
            const messageObject = {
              text: error.response.data.error,
              type: 'error'
            }
            setMessage(messageObject)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            console.log(error.response.data.error)
          })
      }
    } else {
      alert(`${newName} is already added to the phonebook`)
    }
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  
  const handleDelete = (id) => {
    console.log("To delete ", id)
    personServices.deletePerson(id).then(() => {
      setPersons(persons.filter(person => person.id !== id));
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
        <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
        <Persons persons={filteredPersons} handleDelete={handleDelete}/>
    </div>
  )
}

export default App