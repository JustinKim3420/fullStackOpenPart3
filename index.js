const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Using middleware to parse JSON requests to objects
app.use(express.json());
app.use(cors());
app.use(
  morgan((tokens, req, res) => {
    morgan.token("body", (req, res) => {
      return JSON.stringify(req.body);
    });

    if (req.method === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        tokens.body(req, res),
      ].join(" ");
    }
    
    return[
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms"
    ].join(" ");
  })
);

app.use(express.static("build"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

// Respond to get requests to the /api/persons endpoint
app.get("/api/persons", (request, response) => {
  console.log(`Get request made to ${request.url}`);
  response.send(persons);
});

// Get info about the persons list
app.get("/info", (request, response) => {
  let info = {
    length: persons.length,
    date: new Date(),
  };
  response.send(
    `<div>Phonebook has info for ${info.length} people</div>
    <div>${info.date}</div>`
  );
});

// Get info about a person with a specific ID
app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((person) => {
    return person.id === Number(request.params.id);
  });
  if (person) {
    response.send(person);
  } else {
    response.status(404).send("<div>User does not exist</div>");
  }
});

// Create a new user
app.post("/api/persons", (request, response) => {
  let errors = [];
  if (!request.body.name) {
    errors.push("Please enter a name");
  }
  if (!request.body.number) {
    errors.push("Please enter a number");
  }
  if (persons.find((person) => person.name === request.body.name)) {
    errors.push("Please enter a unique name");
  }
  // If any errors, send a status and array with errors
  // Return used to prevent an error of "Cannot set headers ..."
  if (errors.length > 0) {
    return response.status(404).send(errors);
  }
  // Has a chance of creating a duplicate id
  const newId = Math.floor(Math.random() * 100000);
  const newPerson = {
    id: newId,
    ...request.body,
  };
  persons = persons.concat(newPerson);
  response.json(newPerson);
});

// Delete a person with a specific id
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const newPersons = persons.filter((person) => person.id !== id);

  // Checks to see if the user exists see if the persons' array length has changed
  if (newPersons.length === persons.length) {
    response.status(404).send("<div>User does not exist</div>");
  } else {
    persons = newPersons;
    response.status(204).end();
  }
});

// App is taking requests form port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
