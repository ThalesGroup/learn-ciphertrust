import createJWT from "../../utils/create-jwt";
import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";

// Bypass error for self-signed SSL/TLS certificate for the server.

export default async function handler(req, res) {
    if (req.headers.cookie && "ciphertrustJWT" in parse(req.headers.cookie)) {
        let cookies = parse(req.headers.cookie);

        // Check if ciphertrustJWT is set in cookies.

        // Check if JWT is valid.
        const timestamp = Date.now() / 1000;
        if (jwt.decode(cookies.ciphertrustJWT).exp < timestamp) {
            await createNewJWT(res);
        } else {
            // JWT is valid.
            res.status(200).send(cookies.ciphertrustJWT);
        }
    } else {
        await createNewJWT(res);
    }
}

async function createNewJWT(res) {
    // JWT is expired.
    const token = await createJWT();

    // It is best practice to set a cookie as httpOnly. Meaning that it cannot be modified by the browser.
    // More info - https://blog.logrocket.com/jwt-authentication-best-practices/#:~:text=To%20reiterate%2C%20whatever%20you%20do,JWTs%20inside%20an%20httpOnly%20cookie.
    const expiresIn = jwt.decode(token).exp;
    // Leave the options as is. These options are needed to set the cookie securely.
    const options = { maxAge: expiresIn, httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_COOKIE === "true", path: '/' };
    res.setHeader('Set-Cookie', [serialize('ciphertrustJWT', token, options)]);
    res.status(200).send(token);

}
