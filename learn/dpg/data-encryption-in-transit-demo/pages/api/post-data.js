import { randomUUID } from "crypto";
import { dynamoDB, postgreSQL, mongoDB } from "../../util/WriteToDB";

export default async function handler(req, res) {
    // Check if the request method is POST.
    if (req.method === 'POST') {

        const recordID = randomUUID().slice(0, 8);

        // Add UID to form data.
        let jsonData = {
            id: recordID,
            ...req.body
        }

        // Check DB type
        if (req.headers["db-type"] === 'dynamo') {
            console.log("Writing to DynamoDB...");
            return dynamoDB(jsonData).then(data => {
                console.log(data);
                successMessage(res, recordID);
            }).catch(err => {
                console.log(err);
                errorMessage(res);
            });

        } else if (req.headers["db-type"] === 'postgres') {
            console.log("Writing to PostgreSQL...");
            return postgreSQL(jsonData).then(data => {
                console.log(data);
                successMessage(res, recordID);
            }).catch(err => {
                console.log(err);
                errorMessage(res);
            });
        } else if (req.headers["db-type"] === 'mongo') {
            return mongoDB(jsonData).then(data => {
                console.log(data);
                successMessage(res, recordID);
            }).catch(err => {
                console.log(err);
                errorMessage(res);
            });
        } else {
            console.log("Error: Invalid DB type");
            errorMessage(res);
        }
    }
}

function successMessage(res, id) {
    res.status(200).json({ message: "Success", id: id });
}

function errorMessage(res) {
    res.status(500).json({ message: "Error writing to DB" });
}