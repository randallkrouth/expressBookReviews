const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  var { username, password } = req.body;

  if (!username || username.trim() === "") 
  {
    return res.status(400).json({ message: "Error, please provide a valid username." });
  }
  
  if (!password || password.trim() === "") 
  {
    return res.status(400).json({ message: "Error, please provide a valid password." });
  }
  // Loop through the users to check if the username already exists
  for (var i = 0; i < users.length; ++i) 
  {
    if (users[i].username === username) 
    {
      return res.status(400).json({ message: "Error, the user is already in the system." });
    }
  }

  // If the username does not exist, add the new user
  users.push({ username, password });

  // Return a success message
  return res.status(201).json({ message: `User ${username} registered successfully!` });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Simulate an async operation, like fetching books from a database
    const booksList = await getBooks(); // Assuming getBooks is an async function
    return res.status(200).json(booksList);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books", error });
  }
});

// Example async function simulating a database call
async function getBooks() {
  // Simulate a delay (e.g., a DB call)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books); // Return the books array after a delay
    }, 1000);
  });
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  // Retrieve the ISBN from the URL parameters
  var isbn = req.params.isbn;
  
  const getBookByISBNAsync = (isbn) => {
    return new Promise((resolve, reject) => {
        // Simulate fetching data with a delay
        setTimeout(() => {
            let book = null;
            for (let key in books) {
                if (books[key].ISBN === isbn) {
                    book = books[key];
                    break;
                }
            }
            if (book) {
                resolve(book);
            } else {
                reject({ message: "Book not found" });
            }
        }, 500); // Simulate a 500ms delay
    });
};

try {
  const book = await getBookByISBNAsync(isbn);
  return res.status(200).json(book);
} catch (error) {
  return res.status(404).json(error);
}
});

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  const getBooksByAuthorAsync = (author) => {
      return new Promise((resolve) => {
          // Simulate fetching data with a delay
          setTimeout(() => {
              const books_resp = [];
              for (let key in books) {
                  if (books[key].author === author) {
                      books_resp.push(books[key]);
                  }
              }
              resolve(books_resp);
          }, 500); // Simulate a 500ms delay
      });
  };

  try {
      const books_resp = await getBooksByAuthorAsync(author);
      return res.status(200).json(books_resp);
  } catch (error) {
      console.error("Error fetching books:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  const getBookByTitleAsync = (title) => {
      return new Promise((resolve, reject) => {
          // Simulate fetching data with a delay
          setTimeout(() => {
              let book = null;
              for (let key in books) {
                  if (books[key].title === title) {
                      book = books[key];
                      break;
                  }
              }
              if (book) {
                  resolve(book);
              } else {
                  reject({ message: "Book not found" });
              }
          }, 500); // Simulate a 500ms delay
      });
  };

  try {
      const book = await getBookByTitleAsync(title);
      return res.status(200).json(book);
  } catch (error) {
      return res.status(404).json(error);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  var isbn = req.params.isbn;
  var book = null;

  for(var i in books)
  {
      if(books[i]['ISBN'] == isbn)
      {
        book = books[i]['reviews'];
      }
  }

  return res.status(200).json(book);
});

module.exports.general = public_users;
