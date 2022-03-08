const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;


const app = express();
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
dotenv.config({ path: 'config.env' })
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.loggedin = req.flash('loggedin');
    next();
});
// log requests
app.use(morgan('tiny'));

// mongodb connection


// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))

// set view engine
app.set("view engine", "ejs")
    //app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))


// load routers
app.use('/', require('./server/routes/router'));
app.use('/users', require('./server/routes/users'));






// Connect to MongoDB
mongoose
    .connect(
        db, { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session