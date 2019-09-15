const low = require('lowdb');
// Running the DB in synchronus mode
const FileSync = require('lowdb/adapters/FileSync');
const pwd = require('pwd');
const moment = require('moment');

const adapater = new FileSync('db.json');
let db = null;

const init_db = async function(){
  db = low(adapater)
  db.defaults({users: []}).write();
}

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


const fetch_user = function(user){
  return db.get('users').find({'username': user});
}

/**
 * @returns Promise that will resolve when the new user
 * is stored in the db
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
  return pwd.hash(pass).then( result => {
    user.hash = result.hash;
    user.salt = result.salt;

     db.get('users')
    .push(user)
    .write();
  });
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
  ).write();
}

module.exports = {db, add_clock, get_clocks, add_user, init_db, fetch_user};