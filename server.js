const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import custom modules
const db = require('./config/db');
const User = require('./models/User');
const Assessment = require('./models/Assessment');
const routes = require('./routes'); // This should point to your /routes/index.js

const app = express();

// Static files
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// Serve frontend entry point
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'index.html'));
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true only if using HTTPS
}));

// API Routes
app.use('/api', routes);

// Start server
app.listen(3001, () => {
    console.log('✅ Server running on http://localhost:3001');
});
