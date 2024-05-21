const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    year: { type: Number, required: true },
    genre: { type: [String], required: true },
    age_rating: { type: String, required: true },
    plot: { type: String, required: true },
    title: { type: String, required: true },
    average_rating: { type: Number, required: true },
    thumbnail_path: { type: String, required: true },
    director: { type: String, required: true },
    actors: { type: String, required: true },
    trailer: {type: String, required: true}
});

module.exports = mongoose.model("movie", movieSchema);

