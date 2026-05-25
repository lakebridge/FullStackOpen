import { useState } from "react";

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

const Persons = ({ search, persons }) => {
  return (
    <ul style={{ padding: 0, margin: 0 }}>
      {search === ""
        ? persons.map((person) => (
            <li
              style={{ listStyleType: "none", margin: 0, padding: 0 }}
              key={person.name}
            >
              {person.name}: {person.number}
            </li>
          ))
        : persons
            .filter((person) =>
              person.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((person) => (
              <li
                style={{ listStyleType: "none", margin: 0, padding: 0 }}
                key={person.name}
              >
                {person.name}: {person.number}
              </li>
            ))}
    </ul>
  );
};

const App = () => {
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState(["", ""]);

  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

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
    setPersons(
      persons.concat({
        name: newName[0],
        number: newName[1],
        id: persons.length + 1,
      }),
    );

    // CLear the input fields
    setNewName(["", ""]);
  };

  return (
    <div>
      <h1>Phonebook</h1>

      <SearchFilter search={search} setSearch={setSearch} />

      <h2>Add a new</h2>

      <PersonForm newName={newName} setNewName={setNewName} addName={addName} />

      <h2>Numbers</h2>

      <Persons search={search} persons={persons} />
    </div>
  );
};

export default App;
