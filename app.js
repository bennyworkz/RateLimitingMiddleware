const express = require('express');
const rateLimiterMiddleware = require('./middlewares/rateLimiterMiddleware');
const rateLimiterController = require('./controllers/rateLimiterController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(rateLimiterMiddleware);

app.get('/', rateLimiterController.getRequestStatus);

module.exports = app;
