import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import booksRouter from "./routes/booksRoute.js";

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy
// Option 1: Allow all origins with default of cors(*)
// app.use(cors())
// Option 2: All custom origins only
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"]
    })
)

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send("Welcome to MERN. We be merning so hard rn.")
});

// Use middleware for books route
app.use("/books", booksRouter);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("app connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    })