//require necessary non-constant libraries
require('dotenv').config()
require('express-async-errors')

//constant libraries
const express = require('express')
const app = express()
const cors = require('cors')

//Routers
const adminRouter = require('./routes/adminRouter')
const clientRouter = require('./routes/clientRouter')
const carRouter = require('./routes/carRouter')
const carRentalRouter = require('./routes/carRentalRouter')
const commentRouter = require('./routes/commentRouter')
const contactRouter = require('./routes/contactRouter')

//middlewareHandlers
const notFound = require('./middlewares/notFound')
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware')
const connectDb = require('./db/connect')

//middlewares
app.use(express.json())
app.use(cors())

//routes
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/client', clientRouter)
app.use('/api/v1/car', carRouter)
app.use('/api/v1/rental', carRentalRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/contact-us', contactRouter)

//Error Handlers
app.use(notFound)
app.use(errorHandlerMiddleware)

//db connection
const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI)
        app.listen(port, console.log('connecting to port TOMEIY'))
    } catch (error) {
        console.log(error)
    }
}

start()

