import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { importRoutes } from '../Config/routeHandler.config.js';
import { corsConfigGetPost, corsConfigAll } from '../Middlewares/cors.middleware.js';
import { rateLimitMiddleware } from '../Middlewares/rateLimiter.middleware.js';
import { notFoundMiddleware } from '../Middlewares/notFound.middleware.js';

dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 4000;
const router = express.Router();
importRoutes(router);

app
    .set('port', PORT)
    .use(corsConfigGetPost)
    .use(corsConfigAll)
    .use(rateLimitMiddleware)
    .use(express.json())
    .use(morgan('combined'))
    .use(cookieParser())
    .use(router)
    .disable('x-powered-by')
    .use(notFoundMiddleware)

export default app;