import axios from "axios";


async function encryptData(file, jwt) {
    const fileBase64 = (await getBase64(file)).split(",")[1];
    const cipherText = await axios.post(
        // We are using an encrypt proxy because calling the API from the browser will cause a CORS error. The encrypt proxy will point your API request to the Ciphertrust manager Crypto API.
        `/api/encrypt-proxy`, {
            id: "s3-encrypt-symmetric-key",
            plaintext: fileBase64,
            add: "YXV0aGVudGljYXRl"
        }, {
            // Pass the JWT as a Bearer token.
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).catch(err => {
            console.error(err);
            res.status(502).send(err.toString());
        });

    return cipherText.data;
}

// Function that converts our JS file object to base64 string.
const getBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    // handle errors
    reader.onerror = () => {
        console.error(reader.error);
        setOnFileReadError(true);
        reject(reader.error);
    };

});


// Decrypt data
async function decryptData(encryptedData, jwt) {
    const plainText = await axios.post(
        `/api/decrypt-proxy`, {
            ...encryptedData,
            add: "YXV0aGVudGljYXRl"
        }, {
            // Pass the JWT as a Bearer token.
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).catch(err => {
            console.error(err);
        });


    return plainText.data;
}

export { encryptData, decryptData };