// require necessary non-constant libraries
require('dotenv').config();
require('express-async-errors');

// constant libraries
const express = require('express');
const app = express();
const cors = require('cors');

// Routers
const clientRouter = require('./routes/playerRouter');

// middlewareHandlers
const notFound = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');
const connectDb = require('./db/connect');

app.use(cors());
app.use(express.json());

// routes
app.use('/api/v1/client', clientRouter);

// Error Handlers
app.use(notFound);
app.use(errorHandlerMiddleware);

// db connection
const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI);
        app.listen(port, () => console.log('Connecting to port TOMEIY'));
    } catch (error) {
        console.log(error);
    }
};

start();
