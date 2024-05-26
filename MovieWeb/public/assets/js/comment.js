const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const path = require("path");
const router = express.Router();
const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Use static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use("/", router);
app.use(express.json());

// Connect to MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

//comment schema
const commentSchema = new mongoose.Schema({
    movie_id: Number,
    user_id: Number,
    user_name: String,
    content: String,
    rating: Number,
    created_at: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

// Get comments by movie ID
async function getComments(movieID) {
    try {
        await connectToMongoDB();
        const db = client.db("movie-web"); // Database name
        const commentCollection = db.collection("comments"); // comment collection
        const userCollection = db.collection("users"); // user collection

        const comments = await commentCollection
            .aggregate([
                { $match: { movie_id: parseInt(movieID) } }, // Filter comments by movie_id
                {
                    $lookup: {
                        from: "users", // Collection to join
                        localField: "user_name", // Field from the comments collection
                        foreignField: "user_name", // Field from the users collection
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
                        user: { user_name: 1, img_path: 1, }// Include username and img_path from user
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
        await connectToMongoDB();
        var db = client.db("movie-web"); // Database name
        db.collection("comments").insertOne(comment); //insert to db
        return { status: 201, message: "Comment saved to Mongo successfully" };
    } catch (err) {
        console.log(err);
        return { status: 500, error: err.message };
    }
}
//get the website
app.get("/:movieId", async function (req, res) {
    res.sendFile(path.join(__dirname, "public", "watch_movie.html"));
});

//endpoint to take user information
app.get("/user/:userName", async function (req, res) {
    try {
        await connectToMongoDB();
        var db = await client.db("movie-web");
        var users = db.collection("users");
        var user = await users.findOne({ user_name: req.params.userName });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Route to get comments from db
app.get("/comments/:movieId", async (req, res) => {
    try {
        const comments = await getComments(req.params.movieId);
        res.json(comments);
    } catch (error) {
        console.error("Error getting comments:", error);
        res.status(500).json({ error: "Error getting comments" });
    }
});

// Route POST để lưu comment vào MongoDB
app.post("/comment/:movieId", async (req, res) => {
    try {
        //create comment format
        var movie_id = parseInt(req.params.movieId);
        var user_name = "Thành";
        var { content, rating } = req.body;
        var created_at = new Date();

        const comment = new Comment({
            movie_id: movie_id,
            user_name: user_name,
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
// Start the server
app.listen(port, async () => {
    console.log("Server running on port", port);
    //await connectToMongoDB();
});