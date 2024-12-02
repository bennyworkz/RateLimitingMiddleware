const { sendSuccessResponse } = require('../utils/responseUtils');

const getRequestStatus = (req, res) => {
    sendSuccessResponse(res, 200, { message: 'Request is within the allowed limit.' });
};

module.exports = { getRequestStatus };
