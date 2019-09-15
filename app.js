const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const db_utils = require('./db_utils');

const app = express();

const DEBUG = true;

/**
 * ----------------------------
 * ---- Add middleware
 * ----------------------------
 */

app.use(express.static('public'));

/**
 * ----------------------------
 * ---- Define handlers
 * ----------------------------
 */

const login = function(){};

const status = function(user, request, response) {};

/**
 * ----------------------------
 * ---- Define Routes
 * ----------------------------
 */

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/status/:user', status);

// Start the server
db_utils.init_db().then(() => {
  app.listen(process.env.PORT || 3000, () => console.log(`We are listening`));
  if(DEBUG){
    db_utils.add_user("User1", "hunter2").then(() => {
      db_utils.add_clock("User1", "Test Clock");
    })
  }
}).catch(e => {
  console.log(e);
})
