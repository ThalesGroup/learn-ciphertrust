import axios from 'axios';

async function createKey(keyname, jwt) {
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