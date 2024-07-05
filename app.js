require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Routers
const adminRouter = require('./routes/adminRouter');
const clientRouter = require('./routes/clientRouter');
const carRouter = require('./routes/carRouter');
const carRentalRouter = require('./routes/carRentalRouter');
const commentRouter = require('./routes/commentRouter');
const contactRouter = require('./routes/contactRouter');

// Middleware handlers
const notFound = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');
const connectDb = require('./db/connect');

// CORS options
const corsOptions = {
    origin: ["https://tomei-customer.vercel.app"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API routes
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/client', clientRouter);
app.use('/api/v1/car', carRouter);
app.use('/api/v1/rental', carRentalRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/contact-us', contactRouter);

// Error handlers
app.use(notFound);
app.use(errorHandlerMiddleware);

// CORS headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://tomei-customer.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// The "catchall" handler: for any request that doesn't match above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// DB connection
const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Connecting to port ${port}`));
    } catch (error) {
        console.log(error);
    }
};

start();
