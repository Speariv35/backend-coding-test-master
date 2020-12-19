const request = require('supertest');
const assert = require('assert');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
  const notFoundErr = 'RIDES_NOT_FOUND_ERROR';
  const validationErr = 'VALIDATION_ERROR';
  const notFoundErrMsg = 'Could not find any rides';
  const startLatErrMsg = 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively';
  const endLatErrMsg = 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively';
  const riderNameErrMsg = 'Rider name must be a non empty string';
  const req = {
    start_lat: 0,
    start_long: 0,
    end_lat: 0,
    end_long: 0,
    rider_name: 'string',
    driver_name: 'string',
    driver_vehicle: 'string',
  };

  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      return done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    it('should insert ride into DB', (done) => {
      request(app)
        .post('/rides')
        .send(req)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(response.body[0].rideID, 1, 'rideID');
          assert.strictEqual(response.body[0].startLat, req.start_lat, 'startLat');
          assert.strictEqual(response.body[0].startLong, req.start_long, 'startLong');
          assert.strictEqual(response.body[0].endLat, req.end_lat, 'endLat');
          assert.strictEqual(response.body[0].endLong, req.end_long, 'endLong');
          assert.strictEqual(response.body[0].riderName, req.rider_name, 'riderName');
          assert.strictEqual(response.body[0].driverName, req.driver_name, 'driverName');
          assert.strictEqual(response.body[0].driverVehicle, req.driver_vehicle, 'driverVehicle');
          assert.strictEqual(typeof response.body[0].created, 'string', 'Type of  created foeld');
          done();
        });
    });
    it('Should return error if validation of start_lat not passed', (done) => {
      const newReq = { ...req };
      newReq.start_lat = -999;
      request(app)
        .post('/rides')
        .send(newReq)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(response.body.error_code, validationErr, 'Error');
          assert.strictEqual(response.body.message, startLatErrMsg, 'Error Message');
          done();
        });
    });
    it('Should return error if validation of end_lat not passed', (done) => {
      const newReq = { ...req };
      newReq.end_lat = -999;
      request(app)
        .post('/rides')
        .send(newReq)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(response.body.error_code, validationErr, 'Error');
          assert.strictEqual(response.body.message, endLatErrMsg, 'Error Message');
          done();
        });
    });
    it('Should return error if validation of rider_name not passed', (done) => {
      const newReq = { ...req };
      newReq.rider_name = '';
      request(app)
        .post('/rides')
        .send(newReq)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(response.body.error_code, validationErr, 'Error');
          assert.strictEqual(response.body.message, riderNameErrMsg, 'Error Message');
          done();
        });
    });
  });
  describe('GET /rides', () => {
    it('Get All rides from DB with pagination', (done) => {
      request(app)
        .get('/rides/1/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(response.body.length, 1, 'Number of records in DB');
          assert.strictEqual(response.body[0].rideID, 1, 'rideID');
          assert.strictEqual(response.body[0].startLat, req.start_lat, 'startLat');
          assert.strictEqual(response.body[0].startLong, req.start_long, 'startLong');
          assert.strictEqual(response.body[0].endLat, req.end_lat);
          assert.strictEqual(response.body[0].endLong, req.end_long);
          assert.strictEqual(response.body[0].riderName, req.rider_name);
          assert.strictEqual(response.body[0].driverName, req.driver_name);
          assert.strictEqual(response.body[0].driverVehicle, req.driver_vehicle);
          assert.strictEqual(typeof response.body[0].created, 'string');
          done();
        });
    });
    it('Should return error if record for second page not found', (done) => {
      request(app)
        .get('/rides/2/2')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(response.body.error_code, notFoundErr, 'Error');
          assert.strictEqual(response.body.message, notFoundErrMsg, 'Error Message');
          done();
        });
    });
  });
  describe('GET /rides/:id', () => {
    it('Get rides by ID from DB', (done) => {
      request(app)
        .get('/rides/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(response.body.length, 1, 'Number of records in DB');
          assert.strictEqual(response.body[0].rideID, 1, 'rideID');
          assert.strictEqual(response.body[0].startLat, req.start_lat, 'startLat');
          assert.strictEqual(response.body[0].startLong, req.start_long, 'startLong');
          assert.strictEqual(response.body[0].endLat, req.end_lat);
          assert.strictEqual(response.body[0].endLong, req.end_long);
          assert.strictEqual(response.body[0].riderName, req.rider_name);
          assert.strictEqual(response.body[0].driverName, req.driver_name);
          assert.strictEqual(response.body[0].driverVehicle, req.driver_vehicle);
          assert.strictEqual(typeof response.body[0].created, 'string');
          done();
        });
    });
    it('Should return error if record not found', (done) => {
      request(app)
        .get('/rides/2')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(response.body.error_code, notFoundErr, 'Error');
          assert.strictEqual(response.body.message, notFoundErrMsg, 'Error Message');
          done();
        });
    });
  });
});
