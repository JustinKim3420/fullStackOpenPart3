const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.log("error in connecting to MongoDB", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
    minLength:3
  },
  number: {
    type: String,
    unique:true,
    required: true,
    maxLength:8
  },
  date: Date
});

personSchema.plugin(uniqueValidator)

// Used to remove the _id and _v parameters when returning the objects in the DB
// Also converts the _id object to a string and sets it to id
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
