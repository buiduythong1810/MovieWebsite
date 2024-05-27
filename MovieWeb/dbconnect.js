const mongoose = require('mongoose');

// URL kết nối đến MongoDB
// const mongoURI = 'mongodb://0.0.0.0:27017/dbconnect';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/movieweb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed', error);
        process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
    }
};

module.exports = connectDB;
