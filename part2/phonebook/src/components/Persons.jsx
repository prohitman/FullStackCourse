const Person = ({ person, handleDelete }) => {
    return <li>
        {person.name} {person.number}
        <button onClick={() => {
            handleDelete(person.id)
        }}>Delete</button>
    </li>
}

const Persons = ({ persons, handleDelete }) => {
    return <ul>{persons.map((person, id) => <Person key={id} person={person} handleDelete={handleDelete}/>)}</ul>
}

export default Persons