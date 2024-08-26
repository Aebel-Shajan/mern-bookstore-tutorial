export const PORT = 5555;

const username = "root";
const password = "root";
const collection = "books-collection";
const cluster = "mern-bookstore"

export const mongoDBURL = 
 `mongodb+srv://${username}:${password}@${cluster}.bmmna.mongodb.net/${collection}?retryWrites=true&w=majority&appName=mern-bookstore`