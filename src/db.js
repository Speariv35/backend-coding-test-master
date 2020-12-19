let sqlite3 = require('sqlite3');
const buildSchemas = require('./schemas');

sqlite3 = sqlite3.verbose();

const db = new sqlite3.Database(':memory:');
let dbInited;
const instance = () => dbInited;

const initDb = () => {
  if (!dbInited) {
    db.serialize(() => {
      buildSchemas(db);
      dbInited = db;
    });
  }
};

module.exports = { initDb, instance };
