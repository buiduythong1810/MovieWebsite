const express = require('express');
const connectToDatabase = require('./dbconnect'); // Import file dbconnect.js
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const paypal = require('./services/paypal')
const connectDB = require('./dbconnect');
const Invoice = require('./models/Invoice');
const cors = require("cors");

const app = express();
var PORT = process.env.PORT || 8080;
//var PORT = 6000;
// Khi ứng dụng được khởi động, kết nối đến cơ sở dữ liệu MongoDB
connectDB();

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

// app.get('/complete-order', async (req, res) => {

//     try {
//         const captureResponse = await paypal.capturePayment(req.query.token);
//         const invoiceId = captureResponse.id; // Assume the invoice id is in the response

//         res.redirect('/pricing-plan-2.html?paymentStatus=success&invoiceId=' + invoiceId);
//     } catch (error) {
//         // Trường hợp có lỗi, chuyển hướng về trang cũ với thông báo lỗi
//         res.redirect('/pricing-plan-2.html?error=true&errorMessage=' + encodeURIComponent(error.message));
//     }
// })

app.get('/complete-order', async (req, res) => {
    const { token } = req.query;
    try {
        const payment = await paypal.capturePayment(token);

        // Log chi tiết phản hồi để kiểm tra cấu trúc
        console.log('Payment response:', payment);

        // Kiểm tra và truy cập thuộc tính một cách an toàn
        const payerId = payment.payer && payment.payer.payer_id;
        const paymentId = payment.id;

        // Nếu bất kỳ thuộc tính nào không tồn tại, trả về lỗi
        if (!payerId || !paymentId) {
            throw new Error('Incomplete payment information received from PayPal');
        }

        // Lưu hóa đơn vào MongoDB
        const newInvoice = new Invoice({
            paymentId: paymentId,
            token: token,
            payerId: payerId,
            method: 'paypal'
        });

        await newInvoice.save();
        res.send('Payment completed successfully');
    } catch (error) {
        console.error('Error capturing payment:', error);
        res.status(500).send('Error capturing payment');
    }
    
});


app.get('/test-save', async (req, res) => {
    try {
        const testInvoice = new Invoice({
            userId: '60b8d6f7d2a03b0015e7c4c6', // Thay thế bằng ObjectId hợp lệ từ MongoDB của bạn
            amount: {
                currency: 'USD',
                total: '100.00'
            },
            package: 'Test Package',
            paymentMethod: 'PayPal',
            description: 'Test payment for Test Package',
            createTime: new Date(),
            updateTime: new Date(),
            status: 'COMPLETED'
        });

        await testInvoice.save();
        res.send('Invoice saved successfully');
    } catch (error) {
        console.error('Error saving invoice:', error);
        res.status(500).send('Error saving invoice');
    }
});



app.get('/cancel-order', (req, res) => {
    res.redirect('//pricing-plan-2.html')
})

//Code Quoc Anh
const movieRoutes = require("./routes/movies");
app.use(express.json());
app.use(cors({origin:true,credentials:true}));

app.use("/api", movieRoutes);
