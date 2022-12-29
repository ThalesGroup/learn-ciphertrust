import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";
import prisma from "./prisma";
import { MongoClient } from "mongodb";

// Put an item into AWS DynamoDB using the aws-sdk
async function dynamoDB(jsonData) {
    // Store unix epoch timestamp as range key.
    jsonData["createdAt"] = Date.now();

    // Initialize the DynamoDB client
    const region = process.env.AWS_DYNAMODB_REGION;
    const dbClient = new DynamoDBClient({ 
        region: region,
        credentials: {
            accessKeyId: process.env.AWS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    // Create an instance of the AWS SDK
    // const dynamo = new AWS.DynamoDB.DocumentClient();
    // Create an object with the data to be written to the DB
    const params = {
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
        Item: marshall(jsonData),
    };


    // Write the data to the DB
    const data = await dbClient.send(new PutItemCommand(params)).catch(err => {
        console.log(err);
        throw "Error writing to DynamoDB";
    });

    return data;
    
}

async function postgreSQL(jsonData) {
    // convert all datet fields to ISO strings.
    jsonData.dateOfBirth  !== '' ? jsonData.dateOfBirth = new Date(jsonData.dateOfBirth).toISOString() : jsonData.dateOfBirth = null;
    jsonData.dateOfAppointment  !== '' ? jsonData.dateOfAppointment = new Date(jsonData.dateOfAppointment).toISOString() : jsonData.dateOfAppointment = null;

    const data = await prisma.appointment.create({
        data: jsonData
    }).catch(err => {
        console.log(err);
        throw "Error writing to PostgreSQL";
    });

    return data;
}

// `mongoDB` is a function that writes data to MongoDB.
async function mongoDB(jsonData) {
    // convert all datet fields to ISO strings.
    jsonData.dateOfBirth !== '' ? new Date(jsonData.dateOfBirth) : jsonData.dateOfBirth;
    jsonData.dateOfAppointment !== '' ? new Date(jsonData.dateOfAppointment) : jsonData.dateOfAppointment;
    // make the id of mongo document the same as the id of the json body.
    jsonData["_id"] = jsonData.id;

    // Use the mongoDB client to connect to the database.
    console.log(process.env.MONGO_DATABASE_URL);
    const client = new MongoClient(process.env.MONGO_DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true
    });
    await client.connect();
    let db = await client.db(process.env.MONGODB_DB_NAME);
    let collection = await db.collection(process.env.MONGODB_COLLECTION_NAME);
    let result = await collection.insertOne(jsonData);
    console.log(result);
    await client.close();

    return result;
}
    
    

export { dynamoDB, postgreSQL, mongoDB };