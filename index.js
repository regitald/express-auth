const express = require ('express');
const mongoose = require ('mongoose');
const config = require('./config/config');
const routes = require('./routes/routes');

const app = express()
const connectionParams={
    useNewUrlParser: true,
}

//connect to DB
mongoose .connect(
    config.db.connection_uri,
    connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

app.use(express.json())
app.use('/', routes);

app.listen(config.app.port, () => console.log(`Server running on posr: http://localhost:${config.app.port}`))