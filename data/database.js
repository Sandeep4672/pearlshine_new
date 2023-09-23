const { MongoClient } = require('mongodb');

let database;

const mongodbURL = process.env.mongodbURL;  // Ensure this environment variable is correctly set

console.log(mongodbURL);

const client = new MongoClient(mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log(`Connected to the database successfully: ${mongodbURL}`);
        database = client.db('pearlshine');
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
    }
}

function getDb() {
    if (!database) {
        throw new Error('You must connect first!');
    }
    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
};
