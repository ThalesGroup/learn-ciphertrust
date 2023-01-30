import { MongoClient } from "mongodb";

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

export { mongoDB };