const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DocusignStrategy = require('passport-docusign').Strategy;
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');

const envelope = require('./controllers/envelope');
const template = require('./controllers/template');
const user = require('./models/user');

require('dotenv').config();

const app = express();
const port = 3000;


// Set up EJS and middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


// Connect to MongoDB
const connect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.log(err))
}


// Set up sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));


// Set up Passport.js
app.use(passport.initialize());
app.use(passport.session());


// Set up DocuSign OAuth2 strategy
passport.use(new DocusignStrategy({
    clientID: process.env.DOCUSIGN_CLIENT_ID,
    clientSecret: process.env.DOCUSIGN_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/docusign/callback',
    scope: ['signature']
}, (accessToken, refreshToken, profile, cb) => {

    user.create({
        accessToken: accessToken,
        refreshToken: refreshToken
    })

    cb(null, user);

}));

// Serialize and deserialize user
passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

app.get('/', (req, res) => {
    res.render('index', { error: null, success: null });
});

// Route for initiating the OAuth flow
app.get('/auth/docusign', passport.authenticate('docusign'));

// Route for handling the callback from DocuSign
app.get('/auth/docusign/callback',
    passport.authenticate('docusign', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to home page
        res.redirect('/');
    });

// Route for getting template details
app.get('/templates/:templateId', template);

// Route for creating and sending an envelope from a template
app.post('/envelopes', envelope);


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
    connect();
});
