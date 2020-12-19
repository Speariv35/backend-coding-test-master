const express = require('express');
const router = express.Router();

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
  router.get('/', (req, res) => res.send('Healthy'));


module.exports = router;