import jwt from 'jsonwebtoken';
import config from '../config.js';
import jwtInvalidationService from './jwt-invalidation-service.js';

export default function (jwtInvSvc) {
    jwtInvSvc = jwtInvSvc ?? jwtInvalidationService();
    return {
        issueToken: function (payload) {
            return jwt.sign(payload, config.jwt.secret, {
                expiresIn: config.jwt.tokenTtl
            });
        },
        validateToken: async function (token) {
            let verifiedToken = null;
            try {
                verifiedToken = jwt.verify(token, config.jwt.secret);
            }
            catch (e) {
                // This logging is probably unneeded in production environments.
                console.error('Error verifying token: %o', e);
                return {
                    valid: false
                };
            }
            // Standard validation succeeded.  Let's see about the iat:
            const globalInv = await jwtInvSvc.globalInvalidation();
            const userInv = await jwtInvSvc.userInvalidation(verifiedToken.name);
            // Using the most recent date of the two is enough.
            let minimumIat = Math.max(globalInv, userInv);
            if (minimumIat) {
                minimumIat = new Date(minimumIat);
                console.debug('Token subject to minimum issued at verification: %s', minimumIat);
                const issuedAt = new Date(verifiedToken.iat * 1000);
                if (issuedAt < minimumIat) {
                    // This logging is probably unneeded in production environments.
                    console.warn("Token issued at %s for user %s is not acceptable.", issuedAt, verifiedToken.name);
                    return {
                        valid: false
                    };
                }
            }
            return {
                valid: true,
                token: verifiedToken
            };
        }
    }
};
