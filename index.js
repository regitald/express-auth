const express = require ('express');
const mongoose = require ('mongoose');
const config = require('./config/config');
const routes = require('./routes/routes');
const createError = require('http-errors')

const app = express()
const connectionParams={
    useNewUrlParser: true,
}

//connect to DB
mongoose .connect(
    config.db.connection_uri,
    connectionParams)
    .then( () => {
        ('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

app.use(express.json())
app.use('/', routes);

app.use(async (req, res, next) => {
    next(createError.NotFound())
  })
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    })
  })

app.listen(config.app.port, () => console.log(`Server running on posr: http://localhost:${config.app.port}`))