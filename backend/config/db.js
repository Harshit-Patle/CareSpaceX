const mongoose = require('mongoose');  

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB...');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
    }
}; //cd

module.exports = connectdb;
