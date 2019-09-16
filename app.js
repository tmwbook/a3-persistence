const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const pwd = require('pwd');
const nunjucks = require('nunjucks');

const db_utils = require('./db_utils');

const app = express();

const DEBUG = true;

/**
 * ----------------------------
 * ---- Add middleware
 * ----------------------------
 */

app.use(express.static('public'));
app.use(session({secret: "session_secret"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * ---------------------------
 * ---- Passport Helpers
 * ---------------------------
 */

const isAuthed = function(request, response, next){
  if(request.user){
    return next();
  }else{
    return response.status(401).json({
      message: "You are not logged in!",
    });
  }
}

passport.serializeUser(function(user, done){
  done(null, user);
 })

passport.deserializeUser(function(user, done){
  done(null, db_utils.fetch_user(user));
})

passport.use(new LocalStrategy(
  function(username, password, done){
    const user = db_utils.fetch_user(username);
    let salt = user.get("salt").value();
    // Turn the salt into a string for pwd
    salt = salt === undefined ? "" : salt;
    pwd.hash(password, salt)
    .then(() => {
      return done(null, user.get('username').value());
    }).catch(() => {
      return done(null, false, {message: "Invalid username or password"});
    })
  }
))

// Templating engine
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

/**
 * ----------------------------
 * ---- Define handlers
 * ----------------------------
 */

const status = function(request, response) {
  response.render('status.html', {
    title: `Status for ${request.user.get('username').value()}`,
    clocks: request.user.get('clocks').value(),
    user: request.user.get('username'),
  });
};

/**
 * ----------------------------
 * ---- Define Routes
 * ----------------------------
 */

app.get('/', (req, res) => res.send('Hello World!'));
app.post('/login', passport.authenticate('local', {
  successRedirect: '/status',
  failureRedirect: '/login',
  failureFlash: true,
}));
app.get('/status/', isAuthed, status);

// Start the server
db_utils.init_db().then(() => {
  app.listen(process.env.PORT || 3000, () => console.log(`We are listening`));
  if(DEBUG){
    db_utils.add_user("User1", "hunter2").then(() => {
      db_utils.add_clock("User1", "Test Clock");
      db_utils.add_clock("User1", "2nd Clockening");
    })
  }
}).catch(e => {
  console.log(e);
})
