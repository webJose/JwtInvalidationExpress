import tokenService from "../services/token-service.js";

export default async function (req, res, next) {
    const tokenSvc = tokenService();
    // Look for the Authorization header.  It must be a bearer token header.
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const vToken = await tokenSvc.validateToken(token);
        if (vToken.valid) {
            req.sec = vToken.token
        }
    }
    await next();
};
