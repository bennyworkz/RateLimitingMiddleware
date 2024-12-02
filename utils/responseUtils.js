const sendErrorResponse = (res, status, message) => {
    return res.status(status).json({ success: false, message });
};

const sendSuccessResponse = (res, status, data) => {
    return res.status(status).json({ success: true, data });
};

module.exports = { sendErrorResponse, sendSuccessResponse };
