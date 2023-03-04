// import statement in node js files
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

// middleware, which will process into json before
// endpoints use them
// order of this matters (use before or after routes carefully!)
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(n => n.id))
    : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number field cannot be empty'
    })
  } else if (persons.some(person => person.name === request.name)) {
    return response.status(400).json({ 
      error: 'name must be unique'
    })
  }
  
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number, // interesting...?
  }
  
  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`<div>Phonebook has info for ${persons.length} people <br> ${date.toLocaleString()}<div>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)
  
  response.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})