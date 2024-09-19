import { dirname, join } from 'node:path';
import { fileURLToPath  } from 'node:url';
import { createWriteStream } from 'node:fs';
import { sendStandardResponse } from '../Utils/responseBuilder.util.js';

// Path to the blocked IP log file
const __dirname = dirname(fileURLToPath(import.meta.url));
const blockedIPLogPath = join(__dirname, 'blocked_ip.log');

// Object to track requests by IP address
const ipRequestTracker = {};

// Middleware for rate limiting and IP blocking
export const rateLimitMiddleware = async (req, res, next) => {
    const { ip } = req;
    const currentTime = Date.now();
    const windowMs = 60 * 1000;
    const maxRequestsPerWindow = 20;

    // Filter and clean up previous requests within the time window
    ipRequestTracker[ip] = ipRequestTracker[ip]?.filter(request => {
        return request.timestamp > currentTime - windowMs;
    }) || [];

    // Check if the number of requests within the time window exceeds the limit
    if (ipRequestTracker[ip].length >= maxRequestsPerWindow) {
        // Block the IP address and log it to the file
        const blockedIPLogStream = createWriteStream(blockedIPLogPath, { flags: 'a' });
        blockedIPLogStream.write(`${ip} - ${new Date().toISOString()}\n`);
        blockedIPLogStream.end();

        console.log(`Blocked request from: ${ip}`);

        // Send an error response if one has not been sent already
        if (!res.headersSent) {
            await sendStandardResponse(res, false, 'Too Many Requests', 429);
        }
    }

    // Record the new request and proceed to the next middleware
    ipRequestTracker[ip].push({ timestamp: currentTime });
    next();
};