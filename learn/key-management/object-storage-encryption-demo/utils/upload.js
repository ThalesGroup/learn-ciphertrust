// `uploadToS3` function uploads a file to an AWS S3 bucket.
import axios from "axios";

async function uploadToS3(file, key) {

    let { data } = await axios.post("/api/object-storage/aws");

    const url = data.url;
    await axios.put(url, file, {
        headers: {
            "Content-type": file.type,
            "Access-Control-Allow-Origin": "*",
        },
    });

    // Return the URL of the file stored on S3.
    return data.afterUploadURL;
}

export { uploadToS3 };