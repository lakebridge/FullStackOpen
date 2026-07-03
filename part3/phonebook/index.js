const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

app.use(cors());

persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(
    `Server running on port ${PORT} \n:method :url :status :res[content-length] - :response-time ms :body`,
  ),
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/README", (request, response) => {
  const readmePath = path.join(__dirname, "../../README.md");

  console.log("README path:", readmePath);

  response.sendFile(readmePath, (error) => {
    if (error) {
      console.log("sendFile error:", error.message);
      response.status(500).send("Could not send README file");
    }
  });
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`,
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const existingPerson = persons.find((person) => person.name === body.name);
  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`To see the home page, go to http://localhost:${PORT}/`);
  console.log(`To see all persons, go to http://localhost:${PORT}/api/persons`);
  console.log(`To see info, go to http://localhost:${PORT}/info`);
  console.log(
    `To see a specific person, go to http://localhost:${PORT}/api/persons/:id`,
  );
});
