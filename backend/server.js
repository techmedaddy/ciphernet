const app = require('./app');
const mongoose = require('mongoose');

// Load environment variables from .env file
require('dotenv').config();

// MongoDB connection using environment variables
const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/your_database_name';

// Connect to MongoDB
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
