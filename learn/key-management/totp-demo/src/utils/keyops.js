import axios from 'axios';

async function createKey(keyname, jwt) {
    // /api/create-key-proxy rewrites to https://<your_ciphertrust_url>/api/v1/vault/keys2
    // This is done to avoid CORS errors thrown by the browser in the client side.
    const response = await axios.post(
        `/api/create-key-proxy`,
        {
            "name": keyname,
            "algorithm": "aes",
        },
        {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }
    ).catch(err => {
        console.error("Error creating key: ", err);
        return false
    })

    // Export key from CipherTrust Manager
    // /api/export-key-proxy/<keyId> rewrites to https://<your_ciphertrust_url>/api/v1/vault/keys2/<keyId>/export
    // This is done to avoid CORS errors thrown by the browser in the client side.
    const exportResponse = await axios.post(
        `/api/export-key-proxy/${keyname}`,
        {},
        {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }
    ).catch(err => {
        console.error("Error exporting key: ", err);
        return false;
    })

    return exportResponse.data.material;
    

}

export { createKey };
