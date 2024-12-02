const { RATE_LIMIT, WINDOW_MS, BLOCK_TIME } = require('../config/config');
const rateLimiterService = require('../services/rateLimiterService');
const { sendErrorResponse } = require('../utils/responseUtils');

const rateLimiterMiddleware = (req, res, next) => {
    const userIP = req.ip; // Can also use `req.user.id` for authenticated users

    rateLimiterService.checkRequest(userIP, RATE_LIMIT, WINDOW_MS, BLOCK_TIME)
        .then((result) => {
            if (result.allowRequest) {
                next(); // Continue to the next middleware or route
            } else {
                // If rate limit exceeded, include retryAfter in the response
                const retryAfterSecs = Math.ceil(result.retryAfter / 1000); // Convert to seconds
                sendErrorResponse(
                    res, 
                    429, 
                    `Too many requests. Try again after ${retryAfterSecs} seconds.`
                );
            }
        })
        .catch((err) => {
            sendErrorResponse(res, 500, 'Internal server error.');
        });
};

module.exports = rateLimiterMiddleware;
