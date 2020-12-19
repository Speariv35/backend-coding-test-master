const app = require('./src/app');
const db = require('./src/db');
const loggerModule = require('./src/logger/winston');

const port = 8010;

db.initDb();
loggerModule.init();
const logger = loggerModule.instance;

app().listen(port, () => logger().info(`App started and listening on port ${port}`));
