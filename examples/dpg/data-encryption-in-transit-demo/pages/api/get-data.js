import { mongoDB } from "../../util/getEncryptedData";

export default async function handler(req, res) {
    // The sidecar container has automatically decrypted my data on the request, so I will send the same back.
    res.status(200).json(req.body);
}