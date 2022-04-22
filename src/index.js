const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { startDatabase } = require('./database/mongo');
const { deleteGreeting, getGreeting, getGreetings, insertGreeting, updateGreeting } = require('./database/greetings');

// create the Express app
const app = express();

// configure Express middleware
// Helmet - enhances API security
app.use(helmet());
// JSON - built-in middleware to parse JSON bodies into JS objects
app.use(express.json());
// CORS - enable cross-origin support
app.use(cors());
// Morgan - logging
app.use(morgan('combined'));

// configure Express routes / handlers
app.get('/', async (req, res) => {
  res.send(await getGreetings());
});

app.get('/:id', async (req, res) => {
  const greeting = await getGreeting(req.params.id);
  if (greeting) {
    res.send(greeting);
  } else {
    res.status(404);
    res.end();
  }
});

app.post('/', async (req, res) => {
  const greeting = req.body;
  const createdGreeting = await insertGreeting(greeting);
  res.send(createdGreeting);
});

app.put('/:id', async (req, res) => {
  const greeting = req.body;
  const updatedGreeting = await updateGreeting(req.params.id, greeting);
  res.send(updatedGreeting);
});

app.delete('/:id', async (req, res) => {
  await deleteGreeting(req.params.id);
  res.status(204);
  res.end();
});

// start the in-memory MongoDB instance
startDatabase().then(async () => {
  // boostrap the database
  await insertGreeting({
    title: 'Hello from in-memory MongoDB!',
  });

  // start the Express server
  app.listen(3001, () => {
    console.log('listening on port 3001');
  });
});
