const mongoose = require('mongoose');

const connectDb = (url) => {
    return mongoose
        .connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('Database connected successfully'))
        .catch((err) => {
            console.error('Database connection error:', err);
            process.exit(1); // Exit process if database connection fails
        });
};

module.exports = connectDb;
