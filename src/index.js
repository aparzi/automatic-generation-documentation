// importing the dependencies
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const javadocParser = require('./controllers/javadoc-parser');

const app = express();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
    res.send({success: 'ok', message: 'Hello world...'});
});

app.get('/javadoc-parser', javadocParser);

// starting the server
app.listen(5000, () => {
    console.log(`listening on port ${process.env.PORT || 5000}`);
});