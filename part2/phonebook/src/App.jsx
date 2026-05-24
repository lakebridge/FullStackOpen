import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
  ]);
  const [newName, setNewName] = useState(["", ""]);

  const addName = (event) => {
    event.preventDefault();
    console.log("button clicked");
    if (checkIfNameExists(newName[0])) {
      alert(`${newName[0]} is already added to phonebook`);
      return;
    }
    {
      console.log("newName", newName);
      console.log("New name added:", newName[0], newName[1]);
    }
    setPersons(persons.concat({ name: newName[0], number: newName[1] }));

    // CLear the input fields
    setNewName(["", ""]);
  };

  const checkIfNameExists = (name) => {
    return persons.some((person) => person.name === name);
  };

  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
      <ul style={{ padding: 0, margin: 0 }}>
        {persons.map((person) => (
          <li
            style={{ listStyleType: "none", margin: 0, padding: 0 }}
            key={person.name}
          >
            {person.name}: {person.number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
