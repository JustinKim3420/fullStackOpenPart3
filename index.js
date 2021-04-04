require("dotenv").config();
const Person = require("./models/persons");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const persons = require("./models/persons");
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
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      return response.json(person);
    })
    .catch((err) => {
      response.status(404).send("<div>User does not exist</div>");
    });
});

// Create a new user
app.post("/api/persons", (request, response) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
    date: new Date(),
  });
  person.save().then((result) => {
    response.send("<div>Person added to phonebook</div>");
    mongoose.connection.close();
  });
});

// Delete a person with a specific id
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).send("<div>User deleted</div>");
      }else{
        response.status(404).send('<div>User does not exist</div>')
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

// App is taking requests form port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
