const lowdb = require('lowdb');
// Running the DB in synchronus mode
const FileSync = require('lowdb/adapters/FileSync');
const pwd = require('pwd');
const moment = require('moment');

const adapater = new FileSync('db.json');
const db = lowdb(adapater);

/*
user {
  username,
  hash,
  salt,
  clocks: [
    {
      title,
      moment
    }
  ]
}
*/

db.defults({users: []});

const fetch_user = function(user){
  return db.get('users').find({'username': user}).value();
}

/**
 * @param {string} name desired username
 * @param {string} pass unashed password
 */
const add_user = function(name, pass){
  // Hash the pass
  let user = {
    username: name,
    hash: null,
    salt: null,
    clocks: [],
  }
  pwd.hash(pass).then( result => {
    user.hash = result.hash;
    user.salt = result.salt;
  });

  db.get('users')
    .push(user)
    .write();
}


/**
 * Return a list of clock objects for given user
 */
const get_clocks = function(user){
  return fetch_user(user).get('clocks').value();
};


/**
 * Sets a clock with `title` for `username` with the zero point
 * at the current time.
 * @param {string} username the username
 * @param {string} title name of the clock
 */
const add_clock = function(username, title){
  let user = fetch_user(username);
  user.get('clocks').push(
    {
      title: title,
      zero_point: moment(),
    }
  )
}

module.exports = {db, add_clock, get_clocks, add_user};