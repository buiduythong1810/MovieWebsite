const mongoose = require('mongoose');

// URL kết nối đến MongoDB
const mongoURI = 'mongodb://0.0.0.0:27017/dbconnect';

// Hàm để kết nối đến MongoDB và trả về một promise
function connectToDatabase() {
    return new Promise((resolve, reject) => {
        mongoose.connect(mongoURI)
            .then(() => {
                console.log('Đã kết nối đến MongoDB');
                resolve();
            })
            .catch(err => {
                console.error('Không thể kết nối đến MongoDB:', err);
                reject(err);
            });
    });
}

module.exports = connectToDatabase;