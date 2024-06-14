import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";

//configure dotenv
dotenv.config();

//database connection
connectDB();

const app = express();


//middlewares
app.use(express.json());
app.use(morgan('dev'));

//rest api
app.get("/", (req, res )=> {
    res.send(
        "<h1>Welcome</h1>"
    )
})

//Port

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})