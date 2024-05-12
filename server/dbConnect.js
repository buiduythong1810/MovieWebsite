const mongoose = require("mongoose");

const dbConnect = () => {
    const connectionParams = { useNewUrlParser: true };
    mongoose.connect(process.env.DB, connectionParams);

    mongoose.connection.on("connected", () => {
		console.log("Connected to database sucessfully");
	});

	mongoose.connection.on("error", (err) => {
		console.log("Error while connecting to database :" + err);
	});

	mongoose.connection.on("disconnected", () => {
		console.log("Mongodb connection disconnected");
	});
};

// const dbConnect = async () => {
//     try {
//         await mongoose.connect("mongodb://localhost:27017");
//         console.log("CONNECTED TO DATABASE SUCCESSFULLY");
//     } catch (error) {
//         console.error('COULD NOT CONNECT TO DATABASE:', error.message);
//     }
// };

module.exports = dbConnect;