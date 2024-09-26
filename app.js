// require necessary non-constant libraries
require('dotenv').config();
require('express-async-errors');

// constant libraries
const express = require('express');
const app = express();
const cors = require('cors');

// Routers
const playerRouter = require('./routes/playerRouter');

// middlewareHandlers
const notFound = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');
const connectDb = require('./db/connect');

// CORS setup
app.use(cors({
    origin: '*', // Allow requests from any origin, but restrict in production as needed
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'], // Include all necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow content-type and authorization headers
    credentials: true, // If you're sending credentials (cookies, tokens), set this to true
}));

// JSON Parsing Middleware
app.use(express.json());

// API Routes
app.use('/api/v1/player', playerRouter);

// Error Handlers
app.use(notFound);
app.use(errorHandlerMiddleware);

// DB connection and server startup
const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.log(error);
    }
};

start();

module.exports = app;
