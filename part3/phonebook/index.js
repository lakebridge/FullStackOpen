const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const Person = require("./models/person");

app.use(cors());
//app.use(morgan("dev")); // already defined in the next line with custom format

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(
    `\n:method :url :status :res[content-length] - :response-time ms :body`,
  ),
);

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static("dist"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  // response.json(persons);
  Person.find({}).then((people) => {
    console.log("phonebook:");
    response.json(people);
    //mongoose.connection.close(); - this caused the crash of the server after the first request, so I commented it out. The connection should remain open for subsequent requests.
  });
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
  Person.find({}).then((people) => {
    const personCount = people.length;
    response.send(
      `<p>Phonebook has info for ${personCount} people</p><p>${date}</p>`,
    );
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  // const person = persons.find((person) => person.id === id);
  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  Person.findOne({ name: body.name }).then((existingPerson) => {
    if (existingPerson) {
      return response.status(400).json({
        error: "name must be unique",
      });
    }
  });

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then(() => {
      response.json(newPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return response.status(404).json({ error: "Person not found" });
      }

      person.name = body.name;
      person.number = body.number;

      return person.save();
    })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`To see the home page, go to http://localhost:${PORT}/`);
  console.log(`To see all persons, go to http://localhost:${PORT}/api/persons`);
  console.log(`To see info, go to http://localhost:${PORT}/info`);
  console.log(
    `To see a specific person, go to http://localhost:${PORT}/api/persons/:id`,
  );
});
