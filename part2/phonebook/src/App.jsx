import { useState, useEffect } from "react";
import numbersService from "./services/numbers.js"; // Import the numbersService
import {
  Notification,
  ErrorNotification,
} from "../components/notifications.jsx"; // Import the Notification and ErrorNotification components
import "./index.css";

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
  const [notificationMessage, setNotificationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const checkIfNumberExists = (number) => {
    return persons.some((person) => person.number === number);
  };

  const addName = (event) => {
    event.preventDefault();
    console.log("button clicked");

    if (checkIfNameExists(newName[0])) {
      const existingPerson = persons.find(
        (person) => person.name === newName[0],
      );
      const confirmUpdate = window.confirm(
        `${newName[0]} is already added to phonebook. Do you want to update the number?`,
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newName[1] };
        numbersService
          .updatePerson(existingPerson.id, updatedPerson)
          .then((response) => {
            console.log("data from the server", response.data);
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response.data,
              ),
            );
            setNewName(["", ""]); // Clear the input fields after updating
            console.log("Updated person's number:", response.data);
            // Show a notification for the update
            setNotificationMessage(
              `Updated ${newName[0]}'s number successfully.`,
            );
            setTimeout(() => {
              setNotificationMessage("");
            }, 3000);
          });
      }
      return;
    }

    if (checkIfNumberExists(newName[1])) {
      alert(`${newName[1]} is already added to phonebook.`);
      return;
    }

    const personObject = {
      name: newName[0],
      number: newName[1],
    };

    // console.log("running before numbersService.create");

    numbersService
      .create(personObject)
      .then((response) => {
        console.log("data from the server", response.data);
        setPersons(persons.concat(response.data));
        setNotificationMessage(`Added ${newName[0]} successfully.`); // Show a notification for the addition
        setTimeout(() => {
          setNotificationMessage("");
        }, 5000);
        // CLear the input fields
        setNewName(["", ""]);
      })
      .catch((error) => {
        console.error("Error adding person:", error.response.data.error);
        setErrorMessage(
          `Failed to add ${newName[0]}. ${error.response.data.error}`,
        );
        setTimeout(() => {
          setErrorMessage("");
          setNewName(["", ""]);
        }, 5000);
      });
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${person.name}?`,
    );

    if (confirmDelete) {
      numbersService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotificationMessage(`Deleted ${person.name} successfully.`); // Show a notification for the deletion
          setTimeout(() => {
            setNotificationMessage("");
          }, 5000);
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
          setErrorMessage(
            `Failed to delete ${person.name}. It may have already been removed from the server.`,
          );
          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={notificationMessage} />

      <ErrorNotification message={errorMessage} />

      <SearchFilter search={search} setSearch={setSearch} />

      <h2>Add a new</h2>

      <PersonForm newName={newName} setNewName={setNewName} addName={addName} />

      <h2>Numbers</h2>

      <Persons search={search} persons={persons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
