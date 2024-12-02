module.exports = {
    RATE_LIMIT: 10,         // Max requests per minute
    WINDOW_MS: 60000,        // 1 minute window in milliseconds
    BLOCK_TIME: 60000,       // Temporary block for 1 minute after limit exceeded
};
