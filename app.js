const express = require('express');
const bodyParser = require('body-parser');
const studentsRouter = require('./students');
const timeSlotsRouter = require('./timeSlots');
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send("hi");
});
// Serve static files from the 'frontend' directory on the '/home' route
app.use('/home', express.static(path.join(__dirname, 'frontend')));
app.use('/students', studentsRouter);
app.use('/timeslots', timeSlotsRouter);


const port = process.env.PORT || '3000';
app.listen(port, () => {
  console.log('App listening on port 3000');
});
