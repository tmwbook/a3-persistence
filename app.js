const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const db_utils = require('./db_utils');

const app = express();

/**
 * ----------------------------
 * ---- Define handlers
 * ----------------------------
 */

const login = function(){};

const status = function(user) {};

/**
 * ----------------------------
 * ---- Define Routes
 * ----------------------------
 */

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/status/')

// Start the server
app.listen(process.env.PORT || 3000, () => console.log(`We are listening`));
