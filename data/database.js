const { MongoClient } = require('mongodb');

let database;

// Aligning with the Cyclic docs example for environment variable name
const mongodbURL = process.env.MONGO_CONNECTION_STRING || 'mongodb://127.0.0.1:27017';

const client = new MongoClient(mongodbURL);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to the database successfully.');
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
