const express = require('express');
const axios = require('axios');  // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


/**
 * Simulated async call using Promise (e.g., fetching books from a remote source)
 */
function getBooksPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 100); // Simulate delay
    });
}

// Get book list using Promise
public_users.get('/books-promise', (req, res) => {
    getBooksPromise()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: "Failed to fetch books", error: err }));
});

// Get book list using async/await
public_users.get('/books-async', async (req, res) => {
    try {
        const data = await getBooksPromise();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books", error: err });
    }
});

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
      res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  // Check if the ISBN exists in the books object
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    // Filter the books to find all matching the given author
    const matchingBooks = Object.values(books).filter(book => book.author === author);
  
    if (matchingBooks.length > 0) {
      res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      res.status(404).json({ message: "No books found for the given author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    // Filter the books to find all matching the given title
    const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    
    if (matchingBooks.length > 0) {
      res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      res.status(404).json({ message: "No books found for the given title" });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    const reviews = book.reviews;
    res.status(200).json(reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
