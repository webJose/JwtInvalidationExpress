import express from 'express';
import config from './config.js';
// Service that issues and validates tokens.
import tokenService from './services/token-service.js';
// Middleware that copies a valid token's payload into reqest.sec.
import auth from './middleware/auth-middleware.js';
// Service that provides token invalidation dates.
import jwtInvalidationService from './services/jwt-invalidation-service.js';

const jwtInvSvc = jwtInvalidationService();
const tokenSvc = tokenService(jwtInvSvc);
const app = express();
/**
 * Homepage.  It greets the user.  If the request comes with a token,
 * then the greeting contains the user's name and age.
 * 
 * It uses the authentication middleware to ensure the token, if present, 
 * is read.  If a token is present and valid, then the token's payload 
 * will be available as req.sec.
 */
app.get('/', auth, (req, res) => {
    let name = 'stranger';
    let age = null;
    if (req.sec) {
        name = req.sec.name;
        age = req.sec.age;
    }
    res.write(`Hi, ${name}!`);
    if (age) {
        res.write(`  I see you are ${age} years old.`);
    }
    res.status(200).end();
});
/**
 * Login.  Specify name and age in the query string.
 */
app.get('/login', (req, res) => {
    const token = tokenSvc.issueToken({
        name: req.query.name,
        age: req.query.age
    });
    res.status(200).send(token).end();
});
/**
 * Globally invalidate.  Invalidates all previously issued tokens.
 */
app.get('/ginv', (req, res) => {
    const invDate = new Date();
    jwtInvSvc.globalInvalidation(invDate);
    res.write(`Global invalidation set at ${invDate}.`);
    res.status(200).end();
});
/**
 * Per-user invalidate.  Provide the user's name in the query string.
 */
app.get('/uinv', (req, res) => {
    const invDate = new Date();
    jwtInvSvc.userInvalidation(req.query.name, invDate);
    res.write(`Invalidation for user ${req.query.name} set at ${invDate}.`);
    res.status(200).end();
});

app.listen(config.port, () => {
    console.log(`Running on port ${config.port}.  Now listening...`);
});
