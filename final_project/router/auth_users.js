const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

const getUserByUsername = (username) => 
{
  return users.find(user => user.username === username);
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json("Username and password are required." );
  }

  // Find user by username
  const user = getUserByUsername(username);
  if (!user) {
      return res.status(401).json("Invalid username or password.");
  }

  // Check if the password is correct
  if (user.password !== password) {
      return res.status(401).json("Invalid username or password.");
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username: user.username }, "access", { expiresIn: '1h' });

  // Store the token in the session
  req.session.authorization = { accessToken, username: user.username };

  // Send back the token in the response
  return res.status(200).json({ message: "Login successful", accessToken });
});

// Add a book review
// Add or update a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get ISBN from URL params
  const review = req.body.review; // Get review from request body

  if (!review || review.trim() === "") {
    return res.status(400).json("Please provide a valid review.");
  }

  let bookFound = false;
  let index = 0;

  // Check if the book exists
  for (var i in books) {
    if (books[i]['ISBN'] == isbn) {
      book = books[i];
      bookFound = true;
      index = i;
      break;
    }
  }

  if (bookFound == false) {
    return res.status(404).json("Book not found for the provided ISBN.");
  }

  // Get username from session
  const user = req.session.authorization?.username; // Username stored in session (as an example)

  if (!user) {
    return res.status(401).json("User not logged in.");
  }

  // Check if the review already exists from the current user
  var wasFound = false;

  for (var i in books[index]['reviews']) {
    if (books[index]['reviews'][i].username == user) {
      wasFound = true;
      books[index]['reviews'][i].review = review; // Update the review
    }
  }

  if (wasFound == false) {
    books[index]['reviews'].push({ username: user, review: review }); // Add new review
  }

  return res.status(200).json("Review added/updated successfully.");
});

// Delete a book review
regd_users.post("/auth/delete_review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get ISBN from URL params
  let bookFound = false;
  var index = 0;

  for (var i in books) {
    if (books[i]['ISBN'] == isbn) {
      book = books[i];
      bookFound = true;
      index = i;
      break;
    }
  }

  if (bookFound == false) {
    return res.status(404).json("Book not found for the provided ISBN.");
  }

  const user = req.session.authorization?.username; // Assuming the username is stored in the session

  if (!user) {
    return res.status(401).json("User not logged in.");
  }

  // Remove review by the current user
  for (var i in books[index]['reviews']) {
    if (books[index]['reviews'][i].username == user) {
      books[index]['reviews'].splice(i, 1); // Delete the review
      break; // Exit the loop once review is deleted
    }
  }

  return res.status(200).json("Review deleted successfully.");
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
