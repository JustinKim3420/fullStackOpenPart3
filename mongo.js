const mongoose = require('mongoose')

// List of errors. Will only show one error at a time. No multiple console logs.
// The 3rd argument is the password. If not provided, can't access Mongo
let errors = [];

if (process.argv.length < 3) {
    errors.push('Please provide the password as an argument: node mongo.js <password>')
}
// Checks for name parameter
if (process.argv.length < 4) {
    errors.push('Please provide a name')
}

// Check for phone parameter
if (process.argv.length < 5) {
    errors.push('Please provide a phone number')
}

// If there are any errors, end the process
if(errors.length>0){
    console.log(errors, 'Please enter arguments in this format <password> <name field> <number field>');
    errors = [];
    process.exit(1);
}
const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name:String,
    number:string,
    date:Date
})

const Person = mongoose.model('Person', personSchema)

const note = new Note({
    content: 'HTML is Easy',
    date: new Date(),
    important: true,
})

note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})