const dbModule = require('../db');

const db = dbModule.instance;
const loggerModule = require('../logger/winston');

const logger = loggerModule.instance;

const insertRide = async (values) => new Promise((resolve, reject) => {
  const database = db();
  database.run(
    'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
    values,
    function (error) {
      if (error) {
        logger().error(`Error insertRide : ${error}`);
        reject(new Error('DB error'));
      } else {
        database.all(
          'SELECT * FROM Rides WHERE rideID = ?',
          this.lastID,
          (err, insertedRow) => {
            if (err) {
              logger().error(`Error insertRide : ${err}`);
              reject(new Error('DB error'));
            } else {
              resolve(insertedRow);
            }
          },
        );
      }
    },
  );
});

const getRideById = async (riderId) => new Promise((resolve, reject) => db().all(
  `SELECT * FROM Rides WHERE rideID = ${riderId}`,
  (err, res) => {
    if (err) {
      logger().error(`Error getRideById : ${err}`);
      reject(new Error('DB error'));
    } else {
      resolve(res);
    }
  },
));

const getRidesWithPagination = async (pageSize, offset) => new Promise((resolve, reject) => {
  db().all(`SELECT * FROM Rides LIMIT ${pageSize} OFFSET ${offset}`, (err, rows) => {
    if (err) {
      logger().error(`Error getRidesWithPagination : ${err}`);
      reject(new Error('DB error'));
    } else {
      resolve(rows);
    }
  });
});

module.exports = { insertRide, getRideById, getRidesWithPagination };
