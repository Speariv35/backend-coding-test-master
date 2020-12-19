const express = require('express');
const morgan = require('morgan');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const healthRouter = require('./routers/health');
const ridesRouter = require('./routers/rides');
const loggerModule = require('./logger/winston');

const logger = loggerModule.instance;
module.exports = () => {
  const app = express();

  // Routers
  app.use('/health', healthRouter);
  app.use('/rides', ridesRouter);

  // Logger
  app.use(morgan('combined', { stream: logger().stream.write }));

  // Swagger
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
    apis: ['./src/routers/*.js'],
  };
  const specs = swaggerJsdoc(options);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

  return app;
};
