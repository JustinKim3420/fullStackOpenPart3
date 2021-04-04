const mongoose = require('mongoose')

// List of errors. Will only show one error at a time. No multiple console logs.
// The 3rd argument is the password. If not provided, can't access Mongo
let errors = [];

if (process.argv.length < 3) {
    errors.push('Please provide the password as an argument: node mongo.js <password>')
}

// If there are any errors, end the process
if(errors.length>0){
    console.log(errors, 'Please enter arguments in this format <password> <name field> <number field>');
    errors = [];
    process.exit(1);
}
const password = process.argv[2]

const url =
    `mongodb+srv://justinkim3420:${password}@fullstackopen.7xxfg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name:String,
    number:String,
    id:Number,
    date:Date
})

const Person = mongoose.model('Person', personSchema)

// If the only argument provided is the password log all the data
if(process.argv.length===3){
    Person.find({}).then(result=>{
        console.log('Phonebook:')
        result.forEach((person)=>{
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}else{
    const newPerson = new Person({
    name:process.argv[3],
    number:process.argv[4],
    date:new Date()
})

newPerson.save().then(result => {
    console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`)
    mongoose.connection.close()
})}