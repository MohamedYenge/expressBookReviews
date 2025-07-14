const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username===username;
});
if(userswithsamename.length > 0){
    return true;
}else{
    return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validUser= users.filter((user)=>{
    return (user.password===password && user.username===username);
});
if(validUser.length > 0){
    return true;
}else{
    return false;
}

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username =req.body.username;
    const password =req.body.password;
    if(!username || !password){
        res.status(404).json({message:"Error logging in"});
    }
    if(authenticatedUser(username,password)){
        let accessToken= jwt.sign(
          { data:password },
            'access',
           {expiresIn:60*60}

        );
        req.session.authorization ={
            accessToken,
            username
        }
        res.status(200).send("User successfully logged in ");
    }else {
        return res.status(208).json({message:"Invalid logged in .Check password and username"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    
    const username = req.user.data;

    // const token = req.session.authorization['accessToken'];
    // const username = req.session.authorization['username'];

    // jwt.verify(token, 'access', (err, ) => {
    //     if (err) {
    //         return res.status(403).json({message: "Invalid token"});
    //     }

        if (!books[isbn]) {
            return res.status(404).json({message: "Book not found"});
        }

        if (!review) {
            return res.status(400).json({message: "Review text required"});
        }

        // Initialize reviews if doesn't exist
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }

        // Add/update review
        books[isbn].reviews[username] = review;

        return res.status(200).json({
            message: "Review submitted successfully",
            book: books[isbn]
        });
    
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    
    // User is authenticated by the middleware in index.js
    const username = req.user.data; // Using data field from JWT payload
    
    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if book has any reviews
    if (!books[isbn].reviews) {
        return res.status(404).json({ message: "No reviews found for this book" });
    }

    // Check if user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully",
        book: books[isbn]
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
