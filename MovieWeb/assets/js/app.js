const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Function to get titles, thumbnail paths, years, and plots from watchlist of a specific user by user id
async function getWatchlistInfoByUserId(userId) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');
        const movieCollection = database.collection('movies');

        // Find user by user id
        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            console.log('User not found');
            return [];
        }

        // Get watchlist of user
        const watchlist = user.watchlist;

        // Find titles, thumbnail paths, years, and plots from watchlist
        const watchlistInfo = await movieCollection.find({ id: { $in: watchlist } }).project({ _id: 0, thumbnail_path: 1, title: 1, year: 1, plot: 1 }).toArray();

        return watchlistInfo;
    } catch (error) {
        console.error('Error occurred:', error);
        return [];
    } finally {
        await client.close();
    }
}

async function removeAllFromWatchlist(userId) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');

        // Update user's watchlist by setting it to an empty array
        const result = await userCollection.updateOne(
            { id: userId },
            { $set: { watchlist: [] } }
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

async function removeFromWatchlist(userId, movieId) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');

        // Update user's watchlist by removing movieId from it
        const result = await userCollection.updateOne(
            { id: userId },
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

async function getUserInfoById(userId) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');

        // Tìm người dùng theo user id
        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            console.log('User not found');
            return null;
        }

        // Lấy thông tin username, email, avatar_path
        const userInfo = {
            username: user.username,
            email: user.email,
            avatar_path: user.avatar_path
        };

        return userInfo;
    } catch (error) {
        console.error('Error occurred:', error);
        return null;
    } finally {
        await client.close();
    }
}

async function updatePassword(userId, newPassword) {
    try {
        await client.connect();
        const database = client.db('movieweb');
        const userCollection = database.collection('user');

        // Update user's password
        const result = await userCollection.updateOne(
            { id: userId },
            { $set: { password: newPassword } }
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




// Endpoint to get watchlist info by user ID
app.get('/watchlist/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const watchlistInfo = await getWatchlistInfoByUserId(userId);
        res.json(watchlistInfo);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to remove all movies from user's watchlist
app.delete('/watchlist/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const success = await removeAllFromWatchlist(userId);
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
app.delete('/watchlist/:userId/:movieId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const movieId = req.params.movieId;
    try {
        const success = await removeFromWatchlist(userId, movieId);
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
app.get('/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const userInfo = await getUserInfoById(userId);
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
app.put('/account/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const newPassword = req.body.newPassword; // assuming you're passing newPassword in request body

    try {
        const passwordUpdated = await updatePassword(userId, newPassword);
        if (passwordUpdated) {
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found or password not updated' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});