// import statement in node js files
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

require('dotenv').config()
const Phonebook = require('./models/phonebook')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// middleware, which will process into json before
// endpoints use them
// order of this matters (use before or after routes carefully!)
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(requestLogger)
app.use(express.static('build'))

let persons = [] // to be removed l8r

app.get('/info', (request, response) => {
  const date = new Date();
  Phonebook.find({}).then(people => {
    response.send(`<div>Phonebook has info for ${people.length} people <br> ${date.toLocaleString()}<div>`)
  })
})

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(notes => {
    response.json(notes)
  })
})

// next basically says go on, keep feeding it forward
app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then(entry => {
      if (entry) {
        response.json(entry)
      } else {
        response.status(404).end()
      } 
    })
    .catch(error => next(error))
})

// make entry
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if ((body.name === undefined) || (body.number === undefined)) {
    return response.status(400).json({ error: 'content missing' })
  }

  const phonebook = new Phonebook({
    name: body.name,
    number: body.number,
  })

  phonebook.save().then(person => {
    response.json(person)
  }).catch(error => next(error))
})

// update entry
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Phonebook.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})