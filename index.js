let sqlite3 = require('sqlite3');
const app = require('./src/app');
const logger = require('./config/winston');

const port = 8010;

sqlite3 = sqlite3.verbose();

const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

db.serialize(() => {
  buildSchemas(db);

  const application = app(db);

  application.listen(port, () => logger.info(`App started and listening on port ${port}`));
});
