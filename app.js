require('dotenv').config();
const path = require('path');

const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectAuthMiddleware=require('./middlewares/protect-auth');
const protectAdminMiddleware=require('./middlewares/protect-admin');
const notFoundMiddleware = require('./middlewares/not-found');
const authRoutes = require('./routes/auth.routes');
const meetingsRoutes = require('./routes/meeting.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const doctorsRoutes = require('./routes/doctors.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());


app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(protectAuthMiddleware,meetingsRoutes);
//app.use('/cart', cartRoutes);
app.use(protectAuthMiddleware, doctorsRoutes);
app.use('/admin', protectAdminMiddleware, adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const PORT=process.env.PORT || 3000;
console.log("Trying to connect to database");

db.connectToDatabase()
  .then(function () {
    app.listen(PORT,()=>{
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch(function (error) {
    console.log('Failed to connect to the database!');
    console.log(error);
  });
