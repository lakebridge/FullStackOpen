import { useState, useEffect } from "react";
import numbersService from "./services/numbers.js"; // Import the numbersService

// SearchFilter Component outside of App component to avoid re-creation on every render
const SearchFilter = ({ search, setSearch }) => {
  return (
    <div>
      filter shown with:{" "}
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
    </div>
  );
};

// PersonForm Component outside of App component to avoid re-creation on every render
const PersonForm = ({ newName, setNewName, addName }) => {
  return (
    <form>
      <div>
        name:{" "}
        <input
          value={newName[0]}
          onChange={(event) => setNewName([event.target.value, ""])}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={newName[1]}
          onChange={(event) => setNewName([newName[0], event.target.value])}
        />
      </div>
      <div>
        <button type="submit" onClick={addName}>
          add
        </button>
      </div>
    </form>
  );
};

// Persons Component outside of App component to avoid re-creation on every render

const Persons = ({ search, persons, deletePerson }) => {
  const personsToShow =
    search === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(search.toLowerCase()),
        );

  return (
    <ul style={{ padding: 0, margin: 0 }}>
      {personsToShow.map((person) => (
        <li
          style={{ listStyleType: "none", margin: 0, padding: 0 }}
          key={person.name}
        >
          {person.name}: {person.number}{" "}
          {/* Add delete button for each person */}
          {console.log("person id", person.id)}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState(["", ""]);
  //const [notes, setNotes] = useState([]);
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    numbersService.getAll().then((response) => {
      console.log("promise fulfilled");
      console.log("data from the server", response.data);
      setPersons(response.data);
    });
  }, []);

  console.log("persons state", persons);

  const checkIfNameExists = (name) => {
    return persons.some((person) => person.name === name);
  };

  const addName = (event) => {
    event.preventDefault();
    console.log("button clicked");
    if (checkIfNameExists(newName[0])) {
      alert(`${newName[0]} is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newName[0],
      number: newName[1],
    };

    numbersService.create(personObject).then((response) => {
      console.log("data from the server", response.data);
      setPersons(persons.concat(response.data));
    });

    // CLear the input fields
    setNewName(["", ""]);
  };

  const deletePerson = (id) => {
    numbersService.deletePerson(id).then(() => {
      setPersons(persons.filter((person) => person.id !== id));
    });
  };

  return (
    <div>
      <h1>Phonebook</h1>

      <SearchFilter search={search} setSearch={setSearch} />

      <h2>Add a new</h2>

      <PersonForm newName={newName} setNewName={setNewName} addName={addName} />

      <h2>Numbers</h2>

      <Persons search={search} persons={persons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
