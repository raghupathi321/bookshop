const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectWithRetry } = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3000;

const BookRoute = require("./routes/BookRoute")
const UserRoute = require("./routes/UserRoute")

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
      origin: ["https://bookshelf-registry.onrender.com", "https://bookshelf-registry-backend-server.onrender.com"],
        // origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Define API routes here

app.use('/api', BookRoute);
app.use('/api', UserRoute);



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const startServer = async () => {
    try {
        await connectWithRetry();
        app.listen(PORT, () => {
            console.log(`🌎 Now listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
