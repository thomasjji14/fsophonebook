const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 4) {
  console.log('did you forget password, number, or name?');
  process.exit(1)
}

if (process.argv.length > 5) {
  console.log('too many arguments, expected 1 or 3');
  process.exit(1)
}

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  person: String,
  number: String,
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length == 3) { // password only
  
  // parameter to find is object expressing search conditions, e.x.
  // Notefind({ important: true})
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
} else { //b/c of bound checkings previously, this is implied to be 5

  const note = new Note({
    person: process.argv[3],
    number: process.argv[4],
  })
  
  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })

}


