const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose')
const app = express();

require('dotenv').config();

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connected')

  }).catch((e) => {
    console.error(e)
  });

app.get('/', async (req, res, next) => {
  res.send({ message: 'Home' });
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

app.use((req, res, next) => {
  next(createError.NotFound());
});


app.use((err, req, res, next) => {
  res.send({
    status: false,
    message: err.message ?? err,
  });
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
