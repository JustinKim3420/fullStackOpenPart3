require("dotenv").config();
const errorHandler = require("./errorHandler");
const Person = require("./models/persons");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

// Static frontend
app.use(express.static("build"));

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

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);


// Respond to get requests to the /api/persons endpoint
app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

// Get info about the persons list
app.get("/info", (request, response) => {
  Person.countDocuments({}).then((result) => {
    response.send(
      `<div>Phonebook has info for ${result} people</div>
        <div>${new Date()}</div>`
    );
  });
});

// Get info about a person with a specific ID
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

// Create a new user
app.post("/api/persons", (request, response, next) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
    date: new Date(),
  });
  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    response.send(result);
  }).catch(error => next(error))
});

// Delete a person with a specific id
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).send("<div>User deleted</div>");
      } else {
        response.status(404).send("<div>User does not exist</div>");
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Handle all request that have an unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

// App is taking requests form port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
