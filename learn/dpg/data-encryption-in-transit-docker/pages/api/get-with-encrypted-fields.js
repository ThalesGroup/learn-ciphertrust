import { mongoDB, dynamoDB, postgreSQL } from "../../util/getEncryptedData";

export default async function handler(req, res) {
    const id = req.query.id;

    // Check DB type
    if (req.headers["db-type"] === 'mongo') {
        return mongoDB(req.body.id).then(data => {
            successMessage(res, data);
        }).catch(err => {
            console.log(err);
            errorMessage(res);
        });
    } else if (req.headers["db-type"] === 'postgres') {
        return await postgreSQL(req.body.id).then(data => {
            successMessage(res, data);
        }).catch(err => {
            console.log(err);
            errorMessage(res);
        });
    } else if (req.headers["db-type"] === 'dynamo') {
        return await dynamoDB(req.body.id).then(data => {
            successMessage(res, data);
        }).catch(err => {
            console.log(err);
            errorMessage(res);
        });
    } else {
        console.log("Error: Invalid DB type");
        errorMessage(res);
    }
}

function successMessage(res, data) {
    res.status(200).json(data);
}

function errorMessage(res) {
    res.status(500).json({ message: "Error reading DB" });
}