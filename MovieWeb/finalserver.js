const bcrypt = require('bcryptjs');
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
// Connection URI
app.use(cors());
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose");
const uri = process.env.mongoURI;
const client = new MongoClient(uri);

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
        const amount = req.body.amount || '20';
        var username = req.body.username || "john_doe";
        var plan = req.body.plan || "default";
        const url = await paypal.createOrder(amount, username, plan);
        console.log(plan);

        res.redirect(url)
    } catch (error) {
        res.send('Error: ' + error)
    }
})

async function getOrder(orderId) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const ordersCollection = database.collection('orders');

        const order = await ordersCollection.findOne({ orderId });
        return order;
    } catch (error) {
        console.error('Error occurred while retrieving order:', error);
    } finally {
        await client.close();
    }
}

async function updateTypeUser(username) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');

        // Tìm người dùng theo tên người dùng
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            console.log('User not found');
            return;
        }

        // Cập nhật thuộc tính type của người dùng thành "pay"
        const result = await userCollection.updateOne(
            { username: username }, // Điều kiện tìm kiếm người dùng
            { $set: { usertype: 'pay' } } // Dữ liệu cập nhật
        );

        if (result.modifiedCount === 0) {
            console.log('User type was already "pay" or no modification was needed');
        } else {
            console.log(`User type updated successfully for username: ${username}`);
        }

    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await client.close();
    }
}

async function updateVipTime(username, plan) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const usersCollection = database.collection('user');

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await usersCollection.findOne({ username: username });

        let currentDate = new Date();
        let currentVipExpiry = user ? new Date(user.vipExpiry) : null;
        let newVipExpiry;


        if (!user || !user.vipExpiry || new Date(user.vipExpiry) < currentDate) {
            // Nếu không có thời gian VIP hoặc thời gian VIP trước ngày hôm nay
            currentVipExpiry = new Date(currentDate);
        } else {
            // Nếu thời gian VIP sau ngày hôm nay
            currentVipExpiry = new Date(user.vipExpiry);
        }

        switch (plan) {
            case 'month':
                newVipExpiry = new Date(currentVipExpiry.setMonth(currentVipExpiry.getMonth() + 1));
                break;
            case 'quarter':
                newVipExpiry = new Date(currentVipExpiry.setMonth(currentVipExpiry.getMonth() + 3));
                break;
            case 'year':
                newVipExpiry = new Date(currentVipExpiry.setFullYear(currentVipExpiry.getFullYear() + 1));
                break;
            default:
                console.error('Invalid plan');
                return;
        }

        // Cập nhật thời gian VIP của người dùng
        await updateUserVipExpiryInDatabase(username, newVipExpiry);
        console.log(`Cập nhật thời gian VIP cho user ${username} đến ${newVipExpiry}`);
        return newVipExpiry; // Trả về thời gian VIP mới
    } catch (error) {
        console.error('Error occurred while updating VIP time:', error);
    } finally {
        await client.close();
    }
}

async function updateUserVipExpiryInDatabase(username, newVipExpiry) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const usersCollection = database.collection('user');

        // Cập nhật thời gian VIP của người dùng dựa trên username
        const result = await usersCollection.updateOne(
            { username: username },
            { $set: { vipExpiry: newVipExpiry } }
        );

        if (result.matchedCount > 0) {
            console.log(`Cập nhật thời gian VIP cho user ${username} đến ${newVipExpiry}`);
        } else {
            console.warn(`Không tìm thấy user với username: ${username}`);
        }
    } catch (error) {
        console.error('Error occurred while updating VIP expiry:', error);
    } finally {
        await client.close();
    }
}

async function checkAndUpdateUserType(username) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const usersCollection = database.collection('user');

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await usersCollection.findOne({ username: username });

        if (!user) {
            console.warn(`Không tìm thấy user với username: ${username}`);
            return;
        }

        const currentDate = new Date();
        const vipExpiry = new Date(user.vipExpiry);

        // Kiểm tra nếu thời gian VIP trước ngày hôm nay
        if (!user.vipExpiry || vipExpiry < currentDate) {
            // Cập nhật loại người dùng thành 'free'
            const result = await usersCollection.updateOne(
                { username: username },
                { $set: { usertype: 'free' } }
            );

            if (result.matchedCount > 0) {
                console.log(`Cập nhật loại user ${username} thành free vì thời gian VIP đã hết hạn.`);
            } else {
                console.warn(`Không tìm thấy user với username: ${username} để cập nhật loại user.`);
            }
        } else {
            console.log(`User ${username} vẫn còn thời gian VIP.`);
        }
    } catch (error) {
        console.error('Error occurred while checking and updating user type:', error);
    } finally {
        await client.close();
    }
}

app.get('/complete-order', async (req, res) => {
    const orderId = req.query.token; // Lấy orderId từ query params

    try {
        const order = await getOrder(orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        const username = order.username;
        const plan = order.plan;
        const amount = order.amount;

        console.log(`Payment completed for user: ${username}`);

        const vipExpiry = await updateVipTime(username, plan);
        await updateTypeUser(username);

        res.redirect(`/success.html?username=${username}&vipExpiry=${vipExpiry.toISOString().split('T')[0]}&amount=${amount}&plan=${plan}`);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/cancel-order', (req, res) => {
    res.redirect('/pricing-plan-2.html')
})

//Code Quoc Anh
const movieRoutes = require("./routes/movies");
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use("/api", movieRoutes);

// Function to get titles, thumbnail paths, years, and plots from watchlist of a specific user by user id
async function getWatchlistInfoByUserId(username) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');
        const movieCollection = database.collection('movies');

        // Find user by user id
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            console.log('User not found');
            return [];
        }

        // Get watchlist of user
        const watchlist = user.watchlist;

        // Find titles, thumbnail paths, years, and plots from watchlist
        const watchlistInfo = await movieCollection.find({ id: { $in: watchlist } }).project({ _id: 0, id: 1, thumbnail_path: 1, title: 1, year: 1, plot: 1 }).toArray();

        return watchlistInfo;
    } catch (error) {
        console.error('Error occurred:', error);
        return [];
    } finally {
        await client.close();
    }
}

async function removeAllFromWatchlist(username) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');

        // Update user's watchlist by setting it to an empty array
        const result = await userCollection.updateOne(
            { username: username },
            { $pull: { watchlist: [] } }
        );

        if (result.modifiedCount === 0) {
            console.log('User not found');
            return false;
        }

        console.log('All movies removed from watchlist successfully');
        return true;
    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    } finally {
        await client.close();
    }
}

async function removeFromWatchlist(username, movieId) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');
        // Update user's watchlist by removing movieId from it
        const result = await userCollection.updateOne(
            { username: username },
            { $pull: { watchlist: movieId } }
        );

        if (result.modifiedCount === 0) {
            console.log('Movie not found in watchlist');
            return false;
        }

        console.log('Movie removed from watchlist successfully');
        return true;
    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    } finally {
        await client.close();
    }
}

async function getUserInfoById(username) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');

        // Tìm người dùng theo user id
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            console.log('User not found');
            return null;
        }
        //console.log(user);

        // Lấy thông tin username, email, avatar_path
        const userInfo = {
            username: user.username,
            email: user.email,
            thumbnail_path: user.thumbnail_path,
            vipExpiry: new Date(user.vipExpiry).toISOString().split('T')[0]
        };

        console.log(userInfo.vipExpiry);

        return userInfo;
    } catch (error) {
        console.error('Error occurred:', error);
        return null;
    } finally {
        await client.close();
    }
}
async function updatePassword(username, newPassword) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu đã băm vào MongoDB
        const result = await userCollection.updateOne(
            { username: username },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount === 0) {
            console.log('User not found or password not updated');
            return false;
        }

        console.log('Password updated successfully');
        return true;
    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    } finally {
        await client.close();
    }
}

async function getMoviePath(id) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const movieCollection = database.collection('movies');

        // Tìm movie bằng id
        const movie = await movieCollection.findOne({ id: id });

        if (!movie) {
            console.log('Movie not found');
            return [];
        }
        return movie.path;
    } catch (error) {
        console.error('Error occurred:', error);
        return [];
    } finally {
        await client.close();
    }
}

async function getLatestMovieDetail() {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const moviesCollection = database.collection('movies');

        // Tính toán năm hiện tại trừ 1
        const currentYearMinusOne = new Date().getFullYear() - 1;
        // Truy vấn dữ liệu từ collection movies
        const movies = await moviesCollection.find({ year: { $gte: currentYearMinusOne } }).toArray();

        // Lọc và trả về các biến cần thiết
        return movies.map(movie => ({
            id: movie.id,
            title: movie.title,
            thumbnail_path: movie.thumbnail_path,
            rating: movie.average_rating
        }));
    } catch (error) {
        console.error('Error occurred:', error);
        return [];
    }
}

async function getHorrorMovieDetail() {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const moviesCollection = database.collection('movies');
        // Truy vấn dữ liệu từ collection movies
        const movies = await moviesCollection.find({ genre: { $in: ["Action"] } }).toArray();

        // Lọc và trả về các biến cần thiết
        return movies.map(movie => ({
            id: movie.id,
            title: movie.title,
            thumbnail_path: movie.thumbnail_path,
            rating: movie.average_rating
        }));
    } catch (error) {
        console.error('Error occurred:', error);
        return [];
    }
}

async function getHighestRatingMovieDetail() {
    try {
        console.log('da toi');
        await client.connect();
        const database = client.db('movieweb');
        const moviesCollection = database.collection('movies');
        // Truy vấn dữ liệu từ collection movies
        const movies = await moviesCollection.find({ average_rating: { $gte: 4.7 } }).toArray();

        // Lọc và trả về các biến cần thiết
        return movies.map(movie => ({
            id: movie.id,
            title: movie.title,
            thumbnail_path: movie.thumbnail_path,
            rating: movie.average_rating
        }));
    } catch (error) {
        console.error('Error occurred:', error);
        return [];
    }
}

async function getMovieDetail(id) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const movieCollection = database.collection('movies');

        // Tìm movie bằng id
        const movie = await movieCollection.findOne({ id: id });

        if (!movie) {
            console.log('Movie not found');
            return null; // Trả về null nếu không tìm thấy phim
        }

        return {
            title: movie.title,
            director: movie.director,
            genre: movie.genre,
            year: movie.year,
            thumbnail_path: movie.thumbnail_path,
            rating: movie.average_rating,
            plot: movie.plot,
            actors: movie.actors,
            trailer: movie.trailer
        };
    } catch (error) {
        console.error('Error occurred:', error);
        return null; // Trả về null nếu có lỗi xảy ra
    } finally {
        await client.close();
    }
}

async function addToWatchlist(username, movieId) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');
        // Update user's watchlist by adding movieId to it
        const result = await userCollection.updateOne(
            { username: username },
            { $addToSet: { watchlist: movieId } } // Sử dụng $addToSet để thêm movieId vào watchlist
        );

        if (result.modifiedCount === 0) {
            console.log('User not found or movie already in watchlist');
            return false;
        }

        console.log('Movie added to watchlist successfully');
        return true;
    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    } finally {
        await client.close();
    }
}

async function registernow(username, password) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');

        // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
        const existingUser = await userCollection.findOne({ username: username });
        if (existingUser) {
            return false;
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser = {
            username: username,
            password: hashedPassword,
            type: "free",
        };

        const result = await userCollection.insertOne(newUser);
        return true;
    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    } finally {
        await client.close();
    }
}

async function loginnow(username, password) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');

        // Tìm kiếm người dùng trong cơ sở dữ liệu
        const user = await userCollection.findOne({ username: username });

        // Nếu không tìm thấy người dùng hoặc mật khẩu không khớp, phản hồi với thông báo lỗi
        if (!user) {
            return false;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return false;
        }
        //return true;
        return {
            type: user.type
        }
    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    } finally {
        await client.close();
    }
}
async function setUserType(username) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');
        // Tạo filter để tìm các tài liệu có trường 'username' bằng giá trị của biến 'username'
        const filter = { username: username };

        // Tạo update document để thay đổi giá trị trường 'type' thành 'pay'
        const updateDocument = {
            $set: { type: 'pay' }
        };

        // Cập nhật các tài liệu
        const result = await userCollection.updateOne(filter, updateDocument);

        console.log(`${result.matchedCount} tài liệu được tìm thấy.`);
        console.log(`${result.modifiedCount} tài liệu đã được cập nhật.`);

    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    } finally {
        await client.close();
    }

}


// Endpoint to get watchlist info by user ID
app.get('/watchlist/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const watchlistInfo = await getWatchlistInfoByUserId(username);
        res.json(watchlistInfo);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to remove all movies from user's watchlist
app.delete('/watchlist/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const success = await removeAllFromWatchlist(username);
        if (success) {
            res.status(200).json({ message: 'All movies removed from watchlist successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to remove a specific movie from user's watchlist
app.delete('/watchlist/:username/:movieId', async (req, res) => {
    const username = req.params.username;
    const movieId = parseInt(req.params.movieId);
    try {
        const success = await removeFromWatchlist(username, movieId);
        if (success) {
            res.status(200).json({ message: 'Movie removed from watchlist successfully' });
        } else {
            res.status(404).json({ error: 'Movie not found in watchlist' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint để lấy thông tin người dùng theo userId
app.get('/user/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const userInfo = await getUserInfoById(username);
        if (userInfo) {
            res.json(userInfo);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to update user password
app.put('/account/:username', async (req, res) => {
    const username = req.params.username;
    const newPassword = req.body.newPassword; // Nhận newPassword từ body của yêu cầu

    try {
        const passwordUpdated = await updatePassword(username, newPassword);
        if (passwordUpdated) {
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found or password not updated' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/watchmovie/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const path = await getMoviePath(id);
        if (path.length === 0) {
            res.status(404).send('Movie not found');
            return;
        }
        res.send(path);
    } catch (err) {
        console.error('Error retrieving movie path:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Middleware để xử lý yêu cầu từ client
app.get('/index', async (req, res) => {
    try {
        const latestMovies = await getLatestMovieDetail();
        const horrorMovies = await getHorrorMovieDetail();
        const highestRatedMovies = await getHighestRatingMovieDetail();
        res.json({ latestMovies, horrorMovies, highestRatedMovies });

        // Sau khi hoàn thành tất cả các yêu cầu, đóng kết nối đến MongoDB
        await client.close();
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/review/:id', async (req, res) => {
    const movieId = parseInt(req.params.id);

    try {
        // Gọi middleware để lấy thông tin chi tiết về phim
        const movieDetail = await getMovieDetail(movieId);

        if (!movieDetail) {
            // Nếu không tìm thấy phim, trả về mã lỗi 404 và thông báo
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Trả về thông tin chi tiết về phim
        res.json(movieDetail);
    } catch (error) {
        // Nếu có lỗi xảy ra, trả về mã lỗi 500 và thông báo lỗi
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint để thêm một movie vào watchlist của người dùng
app.post('/watchedmovie/:username/:movieId', async (req, res) => {
    const username = req.params.username;
    const movieId = parseInt(req.params.movieId);

    try {
        // Gọi middleware để thêm movie vào watchlist
        const success = await addToWatchlist(username, movieId);

        if (!success) {
            // Nếu không thành công, trả về mã lỗi 404 và thông báo
            return res.status(404).json({ error: 'Failed to add movie to watchlist' });
        }

        // Nếu thành công, trả về mã thành công và thông báo
        res.status(200).json({ message: 'Movie added to watchlist successfully' });
    } catch (error) {
        // Nếu có lỗi xảy ra, trả về mã lỗi 500 và thông báo lỗi
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// login

// Route handler cho endpoint "/register"
app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const success = await registernow(username, password);
        if (!success) {
            return res.status(404).json({ error: 'Username already used' });
        }
        res.status(200).json({ message: 'Register successful' });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const success = await loginnow(username, password);
        if (!success) {
            return res.status(404).json({ error: 'Account or password is incorrect' });
        }
        //res.status(200).json({ message: 'Log in successful' });
        // const id = 123; // Thay thế 123 bằng giá trị id thích hợp
        // const type = "user"; // Thay thế "user" bằng giá trị type thích hợp
        res.status(200).json({ message: 'Log in successful', type: success.type });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// login end

//comment
//comment schema
const commentSchema = new mongoose.Schema({
    movie_id: Number,
    user_id: Number,
    username: String,
    content: String,
    rating: Number,
    created_at: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
async function getComments(movieID) {
    try {
        await client.connect();
        const db = client.db("movieweb"); // Database name
        const commentCollection = db.collection("newcomment"); // comment collection
        const userCollection = db.collection("user"); // user collection

        const comments = await commentCollection
            .aggregate([
                { $match: { movie_id: parseInt(movieID) } }, // Filter comments by movie_id
                {
                    $lookup: {
                        from: "user", // Collection to join
                        localField: "username", // Field from the comments collection
                        foreignField: "username", // Field from the user collection
                        as: "user", // Alias for the joined field
                    },
                },
                {
                    $unwind: "$user", // Unwind the array created by $lookup to get single documents
                },
                {
                    $project: {
                        _id: 0, // Exclude _id field
                        content: 1, // Include content of the comment
                        rating: 1, // Include rating of the comment
                        created_at: 1, // Include created_at of the comment
                        user: { username: 1, thumbnail_path: 1 }// Include username and thumbnail_path from user
                    },
                },
            ])
            .toArray();
        return comments;
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        return [];
    }
}

//function insert comment into MongoDB
async function postComment(comment) {
    try {
        await client.connect();
        var db = client.db("movieweb"); // Database name
        db.collection("newcomment").insertOne(comment); //insert to db
        return { status: 201, message: "Comment saved to Mongo successfully" };
    } catch (err) {
        console.log(err);
        return { status: 500, error: err.message };
    }
}

// //endpoint to take user information
// app.get("/user/:userName", async function (req, res) {
//     try {
//         console.log('ok');
//         await client.connect();
//         var db = await client.db("movieweb");
//         var user = db.collection("user");
//         var user = await user.findOne({ username: req.params.userName });
//         console.log('user data: ',user);
//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// Route to get comments from db
app.get("/getcomments/:movieId", async (req, res) => {
    try {
        const comments = await getComments(req.params.movieId);
        res.json(comments);
    } catch (error) {
        console.error("Error getting comments:", error);
        res.status(500).json({ error: "Error getting comments" });
    }
});

// Route POST để lưu comment vào MongoDB
app.post("/postcomment/:movieId/:username", async (req, res) => {
    try {
        //create comment format
        var movie_id = parseInt(req.params.movieId);
        var username = req.params.username;
        var { content, rating } = req.body;
        var created_at = new Date();

        const comment = new Comment({
            movie_id: movie_id,
            username: username,
            content: content,
            rating: rating,
            created_at: created_at,
        });

        // Gửi comment đến hàm postComment để lưu vào MongoDB
        const response = await postComment(comment);

        // Trả về phản hồi cho người dùng dựa trên phản hồi từ hàm postComment
        res.status(response.status).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = Comment;
//comment end
