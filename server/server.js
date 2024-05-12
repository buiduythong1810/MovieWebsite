require("dotenv").config();
const express = require("express");
const dbConnect = require("./dbConnect");
const movieRoutes = require("./routes/movies");
const cors = require("cors");
const app = express();

dbConnect();

app.use(express.json());
app.use(cors({origin:true,credentials:true}));

app.use("/api", movieRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
