const express = require('express');
const connectToDatabase = require('./dbconnect'); // Import file dbconnect.js
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const paypal = require('./services/paypal')


const app = express();
var PORT = process.env.PORT || 8080;

// Khi ứng dụng được khởi động, kết nối đến cơ sở dữ liệu MongoDB
connectToDatabase()
    .then(db => {
        // Thực hiện các hoạt động với cơ sở dữ liệu ở đây
        app.get('/', (req, res) => {
            db.collection('users').find({}).toArray((err, users) => {
                if (err) {
                    console.error('Lỗi khi truy vấn dữ liệu:', err);
                    res.status(500).send('Đã xảy ra lỗi khi truy vấn dữ liệu');
                    return;
                }
                console.log('Danh sách người dùng:', users);
                res.json(users);
            });
        });
    })
    .catch(err => {
        console.error('Không thể kết nối đến MongoDB:', err);
    });

// Cấu hình đường dẫn tới thư mục chứa các tệp tĩnh như CSS, JS, hình ảnh
app.use(express.static(path.join(__dirname, 'public')));

// Route cho trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(bodyParser.json());


// Khởi động máy chủ
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.post('/pay', async (req, res) => {
    try {
        const amount = req.body.amount || '20'; // Mặc định là $100 nếu không có giá trị
        console.log(amount);
        const url = await paypal.createOrder(amount);

        res.redirect(url)
    } catch (error) {
        res.send('Error: ' + error)
    }
})

app.get('/complete-order', async (req, res) => {
    try {
        await paypal.capturePayment(req.query.token)

        res.send('Course purchased successfully')
    } catch (error) {
        res.send('Error: ' + error)
    }
})

app.get('/cancel-order', (req, res) => {
    res.redirect('/')
})