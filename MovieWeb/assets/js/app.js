const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const publicDirectoryPath = path.join(__dirname, 'MovieWeb'); 
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'MovieWeb', 'index.html'));
});
// Connection URI
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/web';
const client = new MongoClient(uri);

client.connect(async (err) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected successfully to MongoDB');

    const db = client.db('web');
    const usersCollection = db.collection('users');

    // Đăng ký
    app.get('/register', (req, res) => {
        res.sendFile(__dirname + '/register.html');
    });

    app.post('/register', async (req, res) => {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username: username,
            password: hashedPassword
        };

        await usersCollection.insertOne(newUser);
        res.redirect('/login');
    });

    // Đăng nhập
    app.get('/login', (req, res) => {
        res.sendFile(__dirname + '/login.html');
    });

    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const user = await usersCollection.findOne({ username: username });

        if (user && await bcrypt.compare(password, user.password)) {
            // Đăng nhập thành công
            res.redirect('/home');
        } else {
            // Đăng nhập thất bại
            res.send('Đăng nhập thất bại!');
        }
    });

    // Khởi động máy chủ
    const PORT = 3000;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
});
    

// Function to get titles, thumbnail paths, years, and plots from watchlist of a specific user by user id
// async function getWatchlistInfoByUserId(userId) {
//     try {
//         await client.connect();
//         const database = client.db('movieweb');
//         const userCollection = database.collection('user');
//         const movieCollection = database.collection('movies');

//         // Find user by user id
//         const user = await userCollection.findOne({ id: userId });

//         if (!user) {
//             console.log('User not found');
//             return [];
//         }

//         // Get watchlist of user
//         const watchlist = user.watchlist;

//         // Find titles, thumbnail paths, years, and plots from watchlist
//         const watchlistInfo = await movieCollection.find({ id: { $in: watchlist } }).project({ _id: 0, id: 1, thumbnail_path: 1, title: 1, year: 1, plot: 1 }).toArray();

//         return watchlistInfo;
//     } catch (error) {
//         console.error('Error occurred:', error);
//         return [];
//     } finally {
//         await client.close();
//     }
// }

// async function removeAllFromWatchlist(userId) {
//     try {
//         await client.connect();
//         const database = client.db('movieweb');
//         const userCollection = database.collection('user');

//         // Update user's watchlist by setting it to an empty array
//         const result = await userCollection.updateOne(
//             { id: userId },
//             { $pull: { watchlist: [] } }
//         );

//         if (result.modifiedCount === 0) {
//             console.log('User not found');
//             return false;
//         }

//         console.log('All movies removed from watchlist successfully');
//         return true;
//     } catch (error) {
//         console.error('Error occurred:', error);
//         return false;
//     } finally {
//         await client.close();
//     }
// }

// async function removeFromWatchlist(userId, movieId) {
//     try {
//         await client.connect();
//         const database = client.db('movieweb');
//         const userCollection = database.collection('user');
//         // Update user's watchlist by removing movieId from it
//         const result = await userCollection.updateOne(
//             { id: userId },
//             { $pull: { watchlist: movieId } }
//         );

//         if (result.modifiedCount === 0) {
//             console.log('Movie not found in watchlist');
//             return false;
//         }

//         console.log('Movie removed from watchlist successfully');
//         return true;
//     } catch (error) {
//         console.error('Error occurred:', error);
//         return false;
//     } finally {
//         await client.close();
//     }
// }

// async function getUserInfoById(userId) {
//     try {
//         await client.connect();
//         const database = client.db('movieweb');
//         const userCollection = database.collection('user');

//         // Tìm người dùng theo user id
//         const user = await userCollection.findOne({ id: userId });

//         if (!user) {
//             console.log('User not found');
//             return null;
//         }

//         // Lấy thông tin username, email, avatar_path
//         const userInfo = {
//             username: user.username,
//             email: user.email,
//             avatar_path: user.avatar_path
//         };

//         return userInfo;
//     } catch (error) {
//         console.error('Error occurred:', error);
//         return null;
//     } finally {
//         await client.close();
//     }
// }
// async function updatePassword(userId, newPassword) {
//     try {
//         await client.connect();
//         const database = client.db('movieweb');
//         const userCollection = database.collection('user');

//         // Hash mật khẩu mới
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Cập nhật mật khẩu đã băm vào MongoDB
//         const result = await userCollection.updateOne(
//             { id: userId },
//             { $set: { password: hashedPassword } }
//         );

//         if (result.modifiedCount === 0) {
//             console.log('User not found or password not updated');
//             return false;
//         }

//         console.log('Password updated successfully');
//         return true;
//     } catch (error) {
//         console.error('Error occurred:', error);
//         return false;
//     } finally {
//         await client.close();
//     }
// }

// async function getMoviePath(id) {
//     try {
//         await client.connect();
//         const database = client.db('movieweb');
//         const movieCollection = database.collection('movies');

//         // Tìm movie bằng id
//         const movie = await movieCollection.findOne({ id: id });

//         if (!movie) {
//             console.log('Movie not found');
//             return [];
//         }
//         return movie.path;
//     } catch (error) {
//         console.error('Error occurred:', error);
//         return [];
//     } finally {
//         await client.close();
//     }
// }


// // Endpoint to get watchlist info by user ID
// app.get('/watchlist/:userId', async (req, res) => {
//     const userId = parseInt(req.params.userId);
//     try {
//         const watchlistInfo = await getWatchlistInfoByUserId(userId);
//         res.json(watchlistInfo);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Endpoint to remove all movies from user's watchlist
// app.delete('/watchlist/:userId', async (req, res) => {
//     const userId = parseInt(req.params.userId);
//     try {
//         const success = await removeAllFromWatchlist(userId);
//         if (success) {
//             res.status(200).json({ message: 'All movies removed from watchlist successfully' });
//         } else {
//             res.status(404).json({ error: 'User not found' });
//         }
//     } catch (error) {
//         console.error('Error occurred:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Endpoint to remove a specific movie from user's watchlist
// app.delete('/watchlist/:userId/:movieId', async (req, res) => {
//     const userId = parseInt(req.params.userId);
//     const movieId = parseInt(req.params.movieId);
//     try {
//         const success = await removeFromWatchlist(userId, movieId);
//         if (success) {
//             res.status(200).json({ message: 'Movie removed from watchlist successfully' });
//         } else {
//             res.status(404).json({ error: 'Movie not found in watchlist' });
//         }
//     } catch (error) {
//         console.error('Error occurred:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Endpoint để lấy thông tin người dùng theo userId
// app.get('/user/:userId', async (req, res) => {
//     const userId = parseInt(req.params.userId);
//     try {
//         const userInfo = await getUserInfoById(userId);
//         if (userInfo) {
//             res.json(userInfo);
//         } else {
//             res.status(404).json({ error: 'User not found' });
//         }
//     } catch (error) {
//         console.error('Error occurred:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Endpoint to update user password
// app.put('/account/:userId', async (req, res) => {
//     const userId = parseInt(req.params.userId);
//     const newPassword = req.body.newPassword; // Nhận newPassword từ body của yêu cầu

//     try {
//         const passwordUpdated = await updatePassword(userId, newPassword);
//         if (passwordUpdated) {
//             res.json({ message: 'Password updated successfully' });
//         } else {
//             res.status(404).json({ error: 'User not found or password not updated' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });app.get('/watchmovie/:id', async (req, res) => {
//     const id = parseInt(req.params.id);

//     try {
//         const path = await getMoviePath(id);
//         if (path.length === 0) {
//             res.status(404).send('Movie not found');
//             return;
//         }
//         res.send(path);
//     } catch (err) {
//         console.error('Error retrieving movie path:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });


// Start server


