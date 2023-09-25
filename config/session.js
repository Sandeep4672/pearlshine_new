const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');


function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  // Use the environment variable to connect to your online MongoDB
  const store = new MongoDBStore({
    uri: process.env.MONGODB_URL,
    databaseName: 'pearlshine',
    collection: 'sessions'
  });

  // Error handling: Log any connection errors
  store.on('error', function(error) {
    console.error('Session store error:', error);
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: 'super-secret', // Note: You should also store secrets like this in environment variables!
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      httpOnly: true,
      secure: false    
    }
  };
}

module.exports = createSessionConfig;
