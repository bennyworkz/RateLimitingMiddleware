const rateLimitData = new Map(); // Temporary in-memory store for user request data

/**
 * Check if the user request can be allowed based on the rate limit.
 * @param {string} userIP - The IP address of the user.
 * @param {number} limit - Max requests allowed.
 * @param {number} windowMs - Time window in milliseconds.
 * @param {number} blockTimeMs - Time to block the user after exceeding the limit.
 * @returns {Promise<Object>} - Returns an object with `allowRequest` (boolean) and `retryAfter` (time in ms).
 */
const checkRequest = (userIP, limit, windowMs, blockTimeMs) => {
    return new Promise((resolve, reject) => {
        if (!rateLimitData.has(userIP)) {
            // Initialize the user's request data
            rateLimitData.set(userIP, {
                count: 1,
                firstRequestTime: Date.now(),
                blockUntil: null, // If blocked, this field will hold the block expiry time
            });
            return resolve({ allowRequest: true });
        }

        const userData = rateLimitData.get(userIP);
        const currentTime = Date.now();
        const elapsedTime = currentTime - userData.firstRequestTime;

        if (userData.blockUntil && userData.blockUntil > currentTime) {
            // User is still blocked, return the retry time
            const retryAfter = userData.blockUntil - currentTime;
            return resolve({ allowRequest: false, retryAfter });
        }

        if (elapsedTime > windowMs) {
            // Reset user data if the time window has passed
            userData.count = 1;
            userData.firstRequestTime = currentTime;
            userData.blockUntil = null; // Reset block
            rateLimitData.set(userIP, userData);
            return resolve({ allowRequest: true });
        }

        if (userData.count < limit) {
            // Increment the request count within the window
            userData.count++;
            rateLimitData.set(userIP, userData);
            return resolve({ allowRequest: true });
        }

        // Exceeded the rate limit, temporarily block the user
        userData.blockUntil = currentTime + blockTimeMs;
        rateLimitData.set(userIP, userData);
        const retryAfter = userData.blockUntil - currentTime;
        return resolve({ allowRequest: false, retryAfter });
    });
};

module.exports = { checkRequest };
