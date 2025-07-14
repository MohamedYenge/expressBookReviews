const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ 
            message: "Both username and password are required for registration" 
        });
    }

    // Check if username already exists
    if (isValid(username)) {
        return res.status(400).json({ 
            message: "Username already exists. Please choose a different username" 
        });
    }

    // Register the new user
    users.push({ username, password });
    
    return res.status(201).json({
        message: "User registered successfully",
        user: { username } // Return username without password for security
    });
});

// Task 10: Get all books using async/await
public_users.get('/', async (req, res) => {
    try {
        // Simulate async operation with Promise
        const getBooks = () => new Promise(resolve => {
            setTimeout(() => resolve(books), 1000);
        });
        
        const allBooks = await getBooks();
        return res.send(JSON.stringify(allBooks,null,4));
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const getBook = () => new Promise(resolve => {
            setTimeout(() => resolve(books[isbn]), 100);
        });
        
        const book = await getBook();
        if (book) {
            return res.send(JSON.stringify(Book));
        } else {
            return res.status(404).json({message: "Book not found"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error fetching book"});
    }
});

public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const getBooksByAuthor = () => new Promise(resolve => {
            const result = {};
            for (const [isbn, book] of Object.entries(books)) {
                if (book.author.toLowerCase().includes(author.toLowerCase())) {
                    result[isbn] = book;
                }
            }
            setTimeout(() => resolve(result), 100);
        });
        
        const booksByAuthor = await getBooksByAuthor();
        if (Object.keys(booksByAuthor).length > 0) {
            return res.send(JSON.stringify(booksByAuthor,null,4));
        } else {
            return res.status(404).json({message: "No books found by this author"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error fetching books by author"});
    }
});

// Task 13: Get books by title using async/await
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const getBooksByTitle = () => new Promise(resolve => {
            const result = {};
            for (const [isbn, book] of Object.entries(books,nul,4)) {
                if (book.title.toLowerCase().includes(title.toLowerCase())) {
                    result[isbn] = book;
                }
            }
            setTimeout(() => resolve(result), 100);
        });
        
        const booksByTitle = await getBooksByTitle();
        if (Object.keys(booksByTitle).length > 0) {
            return res.send(JSON.stringify(booksByTitle));
        } else {
            return res.status(404).json({message: "No books found with this title"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error fetching books by title"});
    }
});

module.exports.general = public_users;
