const path = require('path');

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const pwd = require('pwd');
const nunjucks = require('nunjucks');
const moment = require('moment');
const favicon = require('serve-favicon');

const db_utils = require('./db_utils');

const app = express();

const DEBUG = true;

/**
 * ----------------------------
 * ---- Add middleware
 * ----------------------------
 */

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));  
app.use(express.static('public'));
app.use(session({secret: "session_secret"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
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
  watch: DEBUG,
});

/**
 * ----------------------------
 * ---- Define handlers
 * ----------------------------
 */

const status = function(request, response) {
  response.render('status.html', {
    clocks: request.user.get('clocks').value(),
    user: request.user.get('username').value(),
  });
};

const resetClock = function(request, response){
  const clock_index = request.body.clock;
  db_utils.reset_clock(request.user, clock_index);
  response.status(200).json({
    message: "GOOD",
  });
}

const addClockView = function(request, response){
  response.render('add_clock.html')
}

const addClock = function(request, response){
  if(request.body.time_setting === "now"){
    db_utils.add_clock(
      request.user.get('username').value(),
      request.body.title
    );
  }else{
    db_utils.add_clock(
      request.user.get('username').value(),
      request.body.title,
      moment(request.body.start_date + request.body.start_time, "YYYY-MM-DDHH:mm")
    );
  }
  response.redirect('/status');
}

const deleteClock = function(request, response){
  const clock_index = request.body.clock;
  db_utils.delete_clock(request.user, clock_index);
  response.redirect('back');
}

const logout = function(request, response){
  request.session.destroy()
  response.redirect('/');
}

/**
 * ----------------------------
 * ---- Define Routes
 * ----------------------------
 */

app.post('/login', passport.authenticate('local', {
  successRedirect: '/status',
  failureRedirect: '/login',
  failureFlash: true,
}));
app.get('/status/', isAuthed, status);
app.post('/reset', isAuthed, resetClock);
app.get('/create', isAuthed, addClockView);
app.post('/create', isAuthed, addClock);
app.post('/delete', isAuthed, deleteClock);
app.get('/logout', isAuthed, logout);

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
