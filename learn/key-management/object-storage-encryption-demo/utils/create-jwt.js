import axios from "axios";

// `createJWT` is a helper function that creates a JWT.
// This function must only called on the server. 
// If you call it on the client-side you will expose your username and password in every request. DO NOT DO THIS. Just use it in a server-side API call.
async function createJWT() {
    const response = await axios.post(
        `${process.env.CTM_URL}/api/v1/auth/tokens`,
        {
            username: process.env.CTM_USERNAME,
            password: process.env.CTM_PASSWORD,
        }
    ).catch(err => {
        console.error(err);
        // res.status(502).send(err.toString());
    });

    const token = response.data.jwt;

    return token
}

export default createJWT;