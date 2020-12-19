/**
 * @swagger
 * components:
 *  schemas:
 *    Rides:
 *      type: array
 *      items:
 *          $ref: '#/components/schemas/RideRes'
 *    RideCreate:
 *      type: object
 *      required:
 *          - start_lat
 *          - start_long
 *          - end_lat
 *          - end_long
 *          - rider_name
 *          - driver_name
 *          - driver_vehicle
 *      properties:
 *          start_lat:
 *              type: integer
 *              description: Start latitude.
 *          start_long:
 *              type: integer
 *              description:  Start longitude.
 *          end_lat:
 *              type: integer
 *              description:  End latitude.
 *          end_long:
 *              type: integer
 *              description:  End longitude
 *          rider_name:
 *              type: string
 *              description:  Rider name.
 *          driver_name:
 *              type: string
 *              description:  Driver name.
 *          driver_vehicle:
 *              type: string
 *              description:  Driver Vehicle.
 *    RideRes:
 *      type: object
 *      properties:
 *          rideID:
 *              type: integer
 *              description: Id of the ride.
 *          startLat:
 *              type: integer
 *              description: Start latitude.
 *          startLong:
 *              type: integer
 *              description:  Start longitude.
 *          endLat:
 *              type: integer
 *              description:  End latitude.
 *          endLong:
 *              type: integer
 *              description:  End longitude
 *          riderName:
 *              type: string
 *              description:  Rider name.
 *          driverName:
 *              type: string
 *              description:  Driver name.
 *          driverVehicle:
 *              type: string
 *              description:  Driver Vehicle.
 *          created:
 *              type: string
 *              description:  Creation time.
 *
 */

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const logger = require('../config/winston');

const app = express();

const jsonParser = bodyParser.json();

app.use(morgan('combined', { stream: logger.stream.write }));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'backend-coding-test-master API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:8010',
      },
    ],
  },
  apis: ['./src/app.js'],
};
const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = (db) => {
  /**
   * @swagger
   *
   * /health:
   *   get:
   *      summary: Health Status
   *      tags: [Health]
   *      responses:
   *          "200":
   *              description: Health status.
   *              content:
   *                  text/plain:
   *                     schema:
   *                         type: string
   *                         example: Healthy
   *
   */
  app.get('/health', (req, res) => res.send('Healthy'));

  /**
   * @swagger
   * /rides:
   *   post:
   *      summary: Add ride
   *      tags: [Rides]
   *      requestBody:
   *          required: true
   *          content:
   *              application/json:
   *                  schema:
   *                       $ref: '#/components/schemas/RideCreate'
   *      responses:
   *          "200":
   *           description: OK
   *           content:
   *              application/json:
   *                  schema:
   *                     $ref: '#/components/schemas/Rides'
   *
   */
  app.post('/rides', jsonParser, (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (
      startLatitude < -90
      || startLatitude > 90
      || startLongitude < -180
      || startLongitude > 180
    ) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message:
          'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (
      endLatitude < -90
      || endLatitude > 90
      || endLongitude < -180
      || endLongitude > 180
    ) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message:
          'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    const values = [
      req.body.start_lat,
      req.body.start_long,
      req.body.end_lat,
      req.body.end_long,
      req.body.rider_name,
      req.body.driver_name,
      req.body.driver_vehicle,
    ];

    const result = db.run(
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values,
      function (err) {
        if (err) {
          return res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          });
        }

        db.all(
          'SELECT * FROM Rides WHERE rideID = ?',
          this.lastID,
          (err, rows) => {
            if (err) {
              return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error',
              });
            }

            res.send(rows);
          },
        );
      },
    );
  });

  /**
   * @swagger
   *
   * /rides:
   *   get:
   *      summary: Get rides
   *      tags: [Rides]
   *      responses:
   *          "200":
   *              description: Rides from DB.
   *              content:
   *                   application/json:
   *                     schema:
   *                      $ref: '#/components/schemas/Rides'
   *
   */
  app.get('/rides', (req, res) => {
    db.all('SELECT * FROM Rides', (err, rows) => {
      if (err) {
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      res.send(rows);
    });
  });

  /**
   * @swagger
   *
   * /rides/{id}:
   *   get:
   *      summary: Get ride by id
   *      tags: [Rides]
   *      parameters:
   *            - in: path
   *              name: id
   *              schema:
   *              type: integer
   *              description: Id of ride to find
   *      responses:
   *          "200":
   *              description: Get Ride by id from DB.
   *              content:
   *                   application/json:
   *                     schema:
   *                      $ref: '#/components/schemas/Rides'
   *
   */
  app.get('/rides/:id', (req, res) => {
    db.all(
      `SELECT * FROM Rides WHERE rideID='${req.params.id}'`,
      (err, rows) => {
        if (err) {
          return res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          });
        }

        if (rows.length === 0) {
          return res.send({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          });
        }

        res.send(rows);
      },
    );
  });

  return app;
};
