import { sendStandardResponse } from '../Utils/responseBuilder.util.js';
import { verifyToken } from '../Service/jwt.service.js';

export const authRequired = async (req, res, next) => {
    try {        
        const { access_token: accessToken } = req.cookies;
            
        if (!accessToken) return await sendStandardResponse(res, false, 'Access not authorized', 403);

        const { valid, status, message, data} = await verifyToken(accessToken);

        if (!valid) return await sendStandardResponse(res, valid, message, status, data);

        req.decoded = data;
        next();

    } catch {
        console.error('Error middleware validate token', error);
        await sendStandardResponse(res, false, 'Internal server error', 500);
    }
};