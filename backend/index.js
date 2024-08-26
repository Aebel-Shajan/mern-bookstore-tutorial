import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

// Middleware for parsing request body
app.use(express.json());

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send("Welcome to MERN. We be merning so hard rn.")
});

// Route for saving a new book
app.post("/books", async (request, response) => {
    try {
        // Check if request body is of correct type
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear'
            });
        }

        // Create new book object
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
        
        // Call book model which lets mongoose create and add a new entry to mongodb db.
        const book = await Book.create(newBook);
        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message})
    }
})

// Route to get all books from database
app.get("/books", async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message})
    }
})

// Route to get all books from database
app.get("/books/:id", async (request, response) => {
    try {
        const {id} = request.params
        const book = await Book.findById(id);
        return response.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message})
    }
})

// Route to update a book
app.put("/books/:id", async (request, response) => {
    try {
        // Check if request body is of correct type
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear'
            });
        }
        
        const {id} = request.params;
        const result = await Book.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({message: "Book not found"});
        }
        return response.status(200).send({message: 'Book updated successfully'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route to delete a book
app.delete("/books/:id", async (request, response) => {
    try {
        const {id} = request.params;
        const result = await Book.findByIdAndDelete(id);
        
        if (!result) {
            return response.status(404).json({message: "Book not found"});
        }

        return response.status(200).send({message: "Book deleted successfully"})
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message})
    }
});


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