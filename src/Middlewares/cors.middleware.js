import { dirname, join } from 'node:path';
import { fileURLToPath  } from 'node:url';
import fs from 'node:fs/promises';
import cors from 'cors';

const allowedOriginsGetPost = ['http://localhost:4001','http://localhost:5173'];
const allowedOriginsAll = ['http://localhost:4001','http://localhost:5173'];
const __dirname = dirname(fileURLToPath(import.meta.url));

const createCorsOptions = (allowedOrigins, allowedMethods) => {
    return {
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                const blockedOrigin = origin || 'Unknown';
                const logFilePath = join(__dirname, 'blocked_origins.log');

                fs.appendFile(logFilePath, blockedOrigin + '\n').catch(err => {
                    console.error('Error writing to blocked origins log:', err);
                });

                console.log(`Blocked request from: ${blockedOrigin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: allowedMethods
    };
};

const corsOptionsGetPost = createCorsOptions(allowedOriginsGetPost, ['GET', 'POST']);
const corsOptionsAll = createCorsOptions(allowedOriginsAll, ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE']);

export const corsConfigGetPost = cors(corsOptionsGetPost);
export const corsConfigAll = cors(corsOptionsAll);