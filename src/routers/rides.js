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

const router = express.Router();
const bodyParser = require('body-parser');
const constants = require('../constants/constants');
const ridesRepo = require('../repositories/ridesRepo');

const jsonParser = bodyParser.json();

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
router.post('/', jsonParser, async (req, res) => {
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
      error_code: constants.errorCode.validation,
      message: constants.errorMessages.startLatValidation,
    });
  }

  if (
    endLatitude < -90
        || endLatitude > 90
        || endLongitude < -180
        || endLongitude > 180
  ) {
    return res.send({
      error_code: constants.errorCode.validation,
      message: constants.errorMessages.endLatValidation,
    });
  }

  if (typeof riderName !== 'string' || riderName.length < 1) {
    return res.send({
      error_code: constants.errorCode.validation,
      message: constants.errorMessages.riderNameValidation,
    });
  }

  if (typeof driverName !== 'string' || driverName.length < 1) {
    return res.send({
      error_code: constants.errorCode.validation,
      message: constants.errorMessages.driverNameValidation,
    });
  }

  if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
    return res.send({
      error_code: constants.errorCode.validation,
      message: constants.errorMessages.driverNameValidation,
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

  try {
    const rows = await ridesRepo.insertRide(values);
    return res.send(rows);
  } catch (err) {
    return res.send({
      error_code: constants.errorCode.serverError,
      message: constants.errorMessages.unknownError,
    });
  }
});

/**
 * @swagger
 *
 * /rides/{page}/{pageSize}:
 *   get:
 *      summary: Get rides
 *      tags: [Rides]
 *      parameters:
 *            - in: path
 *              name: page
 *              schema:
 *              type: integer
 *              description: Page to query from DB (default 1)
 *            - in: path
 *              name: pageSize
 *              schema:
 *              type: integer
 *              description: Number of records on page (default 10)
 *      responses:
 *          "200":
 *              description: Rides from DB.
 *              content:
 *                   application/json:
 *                     schema:
 *                      $ref: '#/components/schemas/Rides'
 *
 */
router.get('/:page/:pageSize', async (req, res) => {
  const page = Number(req.params?.page) > 0 ? req.params?.page : 1;
  const pageSize = Number(req.params.pageSize) || 10;
  const offset = ((page - 1) * pageSize);
  try {
    const rows = await ridesRepo.getRidesWithPagination(pageSize, offset);
    if (rows.length === 0) {
      return res.send({
        error_code: constants.errorCode.ridesNotFound,
        message: constants.errorMessages.ridesNotFound,
      });
    }

    return res.send(rows);
  } catch (err) {
    return res.send({
      error_code: constants.errorCode.serverError,
      message: constants.errorMessages.unknownError,
    });
  }
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
router.get('/:id', async (req, res) => {
  try {
    const rideId = req.params.id;
    const rows = await ridesRepo.getRideById(rideId);
    if (rows.length === 0) {
      return res.send({
        error_code: constants.errorCode.ridesNotFound,
        message: constants.errorMessages.ridesNotFound,
      });
    }

    return res.send(rows);
  } catch (err) {
    return res.send({
      error_code: constants.errorCode.serverError,
      message: constants.errorMessages.unknownError,
    });
  }
});

module.exports = router;
