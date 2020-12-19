module.exports = {
  errorCode: {
    validation: 'VALIDATION_ERROR',
    serverError: 'SERVER_ERROR',
    ridesNotFound: 'RIDES_NOT_FOUND_ERROR',

  },
  errorMessages: {
    startLatValidation: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    endLatValidation: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    riderNameValidation: 'Rider name must be a non empty string',
    driverNameValidation: 'Driver name must be a non empty string',
    driverVehicleValidation: 'Driver vehicle name must be a non empty string',
    unknownError: 'Unknown error',
    ridesNotFound: 'Could not find any rides',
  },
};
