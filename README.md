# JwtInvalidationExpress

> NodeJS Express server that exemplifies how to invalidate JWT's by their "issued at" claim value.

## Purpose

This is a sample Express HTTP server that demonstrates how to invalidate JSON web tokens by its creation time 
(a. k. a. its `iat` claim).

It uses **ES Modules** and modern JavaScript syntax.  While I did not test, it probably works with NodeJS v16.9.0 and 
above, but in all honesty, I have only ever run it in NodeJS v18.  Note that the [wj-config](https://www.npmjs.com/package/wj-config) 
package imposes a minimum NodeJS version of 16.9.0.

Read [this article](https://webjose.hashnode.dev/invalidating-json-web-tokens-jwt-nodejs-express) for a detailed explanation of how all this works.

Have fun!

## How to Run This

1. Ensure a proper modern version of NodeJS.
2. Clone this repository.
3. Open bash or PowerShell in the `/src` folder and run `npm ci`.
4. Create a MySQL database and a corresponding user.
5. Create the MySQL table using the SQL file provided in the `/sql` folder.
6. Configure your MySQL server and database details in `/src/config.js`.
7. Open the repository in **Visual Studio Code** and just press F5 (Run command).  It will work because this repository has the necessary `launch.json` file.
8. If not running it with Visual Studio Code, just launch `node ./src/index.js`.
9. Now the HTTP server is accessible through the URL **http://localhost:7777/**.
