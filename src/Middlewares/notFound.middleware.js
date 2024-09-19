import { sendStandardResponse } from '../Utils/responseBuilder.util.js';

export const notFoundMiddleware = async (req, res, next) => {
    await sendStandardResponse(res, false, '404 - Not Found', 404);
};