// // const router = require("express").Router();
// // const Movie = require("../models/Movie");
// // const movies = require("../config/movies.json");

// // router.get("/movies", async (req, res) => {
// //     try {
// //         const page = parseInt(req.query.page) - 1 || 0;
// //         const limit = parseInt(req.query.limit) || 5;
// //         const search = req.query.search || "";
// //         let sort = req.query.sort || "rating";
// //         let genre = req.query.genre || "- All -";
// //         let year = req.query.year || "- All -";
// //         let rating = req.query.rating || "- All -";
// //         let age_rating = req.query.age_rating || "- All -";
// //         const genreOptions = [
// //             "Action",
// //             "Romance",
// //             "Fantasy",
// //             "Drama",
// //             "Crime",
// //             "Adventure",
// //             "Thriller",
// //             "Sci-fi",
// //             "Music",
// //             "Family",
// //         ];

// //         const yearOptions = []; // Tạo mảng chứa các năm từ dữ liệu

// //         // Tạo mảng các rating từ dữ liệu
// //         const ratingOptions = ["- All -",1,2,3,4,5];
// //         const age_ratingOptions = [ "- All -","U","UA","A","UA7+","S","UA13+","UA16+","UA18+"];
// //         genre === "- All -"
// //             ? (genre = [...genreOptions])
// //             : (genre = req.query.genre.split(","));
// //         req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

// //         let sortBy = {};

// //         // Tạo đối tượng để lọc theo năm và rating
// //         let filterOptions = {
// //             name: { $regex: search, $options: "i" },
// //             genre: { $in: [...genre] },
// //         };

// //         if (year !== "- All -") {
// //             filterOptions.year = year;
// //         }

// //         if (rating !== "- All -") {
// //             filterOptions.rating = rating;
// //         }
// //         if (age_rating !== "- All -") {
// //             filterOptions.age_rating = age_rating;
// //         }
// //         const movies = await Movie.find(filterOptions)
// //             .sort(sortBy)
// //             .skip(page * limit)
// //             .limit(limit);

// //         const total = await Movie.countDocuments(filterOptions);

// //         const response = {
// //             error: false,
// //             total,
// //             page: page + 1,
// //             limit,
// //             genres: genreOptions,
// //             years: yearOptions,
// //             rating: ratingOptions,
// //             age_rating: age_ratingOptions,
// //             movies,
// //         };

// //         res.status(200).json(response);
// //     } catch (err) {
// //         console.log(err);
// //         res.status(500).json({ error: true, message: "Internal Server Error" });
// //     }
// // });

// // const insertMovies = async () => {
// //     try {
// //         const docs = await Movie.insertMany(movies);
// //         return Promise.resolve(docs);
// //     } catch (err) {
// //         return Promise.reject(err)
// //     }
// // };

// // insertMovies()
// //     .then((docs) => console.log(docs))
// //     .catch((err) => console.log(err))

// // module.exports = router;

// // const router = require("express").Router();
// // const Movie = require("../models/Movie");
// // const movies = require("../config/movies.json");

// // router.get("/movies", async (req, res) => {
// //     try {
// //         const page = parseInt(req.query.page) - 1 || 0;
// //         const limit = parseInt(req.query.limit) || 5;
// //         const search = req.query.search || "";
// //         let sort = req.query.sort || "rating";
// //         let genre = req.query.genre || "All";
// //         let year = req.query.year || "All";
// //         let rating = req.query.rating || "All";

// //         const genreOptions = [
// //             "Action",
// //             "Romance",
// //             "Fantasy",
// //             "Drama",
// //             "Crime",
// //             "Adventure",
// //             "Thriller",
// //             "Sci-fi",
// //             "Music",
// //             "Family",
// //         ];

// //         const yearOptions = []; // Tạo mảng chứa các năm từ dữ liệu

// //         // Tạo mảng các rating từ dữ liệu
// //         const ratingOptions = ["All", 1, 2, 3, 4, 5];

// //         genre === "All"
// //             ? (genre = [...genreOptions])
// //             : (genre = req.query.genre.split(","));
// //         req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

// //         let sortBy = {};

// //         // Tạo đối tượng để lọc theo năm và rating
// //         let filterOptions = {
// //             name: { $regex: search, $options: "i" },
// //             genre: { $in: [...genre] },
// //         };

// //         if (year !== "All") {
// //             filterOptions.year = year;
// //         }

// //         if (rating !== "All") {
// //             filterOptions.rating = rating;
// //         }

// //         const movies = await Movie.find(filterOptions)
// //             .sort(sortBy)
// //             .skip(page * limit)
// //             .limit(limit);

// //         const total = await Movie.countDocuments(filterOptions);

// //         const response = {
// //             error: false,
// //             total,
// //             page: page + 1,
// //             limit,
// //             genres: genreOptions,
// //             years: yearOptions,
// //             rating: ratingOptions,
// //             movies,
// //         };

// //         res.status(200).json(response);
// //     } catch (err) {
// //         console.log(err);
// //         res.status(500).json({ error: true, message: "Internal Server Error" });
// //     }
// // });

// // module.exports = router;

const router = require("express").Router();
const Movie = require("../models/Movie");
const movies = require("../config/movies.json");

router.get("/movies", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        let sort = req.query.sort || "rating";
        let genre = req.query.genre || "All";
        let year = req.query.year || "All";
        let rating = req.query.rating || "All";
        let age_rating = req.query.age_rating || "All";

        // console.log('Year   ',year);


        const genreOptions = [
            "Action",
            "Romance",
            "Fantasy",
            "Drama",
            "Crime",
            "Adventure",
            "Thriller",
            "Sci-fi",
            "Music",
            "Family",
        ];

        const yearOptions = []; // Tạo mảng chứa các năm từ dữ liệu

        // Tạo mảng các rating từ dữ liệu
        const ratingOptions = [];

        const ageRatingOptions = [];

        genre === "All"
            ? (genre = [...genreOptions])
            : (genre = req.query.genre.split(","));
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "desc";
		}
        // Tạo đối tượng để lọc theo năm, rating và age_rating
        let filterOptions = {
            name: { $regex: search, $options: "i" },
            genre: { $in: [...genre] },
            // year: { $in: [...year] },
            // rating: { $in: [...rating] }
            // age_rating: { $in: [...age_rating] }
        };
        // console.log('Year   ',year);
        if (year !== "All") {

            filterOptions.year = year;
            
        }

        console.log('Year1   ',year);
        console.log('Year2   ',filterOptions.year);
        console.log('Genre      ',filterOptions.genre);
        // console.log('Year   ',year);
        if (rating !== "All") {
            filterOptions.rating = rating;
        }

        if (age_rating!== "All") {
            filterOptions.age_rating = age_rating;
        }


        const movies = await Movie.find(filterOptions)
            .where("genre")
			.in([...genre])
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

        const total = await Movie.countDocuments(filterOptions);

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            genres: genreOptions,
            years: yearOptions,
            rating: ratingOptions,
            age_rating: ageRatingOptions,
            movies,
        };
        console.log("Filter Options:", filterOptions);
        console.log("Sort By:", sortBy);

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// const insertMovies = async () => {
//     try {
//         const docs = await Movie.insertMany(movies);
//         return Promise.resolve(docs);
//     } catch (err) {
//         return Promise.reject(err)
//     }
// };

// insertMovies()
//     .then((docs) => console.log(docs))
//     .catch((err) => console.log(err))


module.exports = router;


