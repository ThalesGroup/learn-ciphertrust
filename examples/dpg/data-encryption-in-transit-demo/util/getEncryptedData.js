import { GetItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { MongoClient } from "mongodb";
import prisma from "./prisma";
import { unmarshall } from "@aws-sdk/util-dynamodb";

async function mongoDB(id) {

    // Use the mongoDB client to connect to the database.
    const client = new MongoClient(process.env.MONGO_DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true
    });
    await client.connect();
    let db = await client.db(process.env.MONGODB_DB_NAME);
    let collection = await db.collection(process.env.MONGODB_COLLECTION_NAME);
    let result = await collection.findOne({ _id: id });
    console.log(result);
    await client.close();


    return result;
}

// Fetch an item into AWS DynamoDB using the aws-sdk
async function dynamoDB(id) {
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
        Key: {
            id: { S: id }
        }
    };


    // Write the data to the DB
    const data = await dbClient.send(new GetItemCommand(params)).catch(err => {
        console.log(err);
        throw "Error writing to DynamoDB";
    });

    return unmarshall(data["Item"]);
    
}

async function postgreSQL(id) {

    const data = await prisma.appointment.findUnique({
        where: {
            id: id
        }
    }).catch(err => {
        console.log(err);
        throw "Error writing to PostgreSQL";
    });

    console.log(data);

    return data;
}

export { mongoDB, dynamoDB, postgreSQL };