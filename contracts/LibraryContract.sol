// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LibraryContract {
    struct Book {
        uint id;
        string title;
        string author;
        bool available;
    }

    mapping(uint => Book) public books; // Maps book ID to Book
    mapping(string => uint) private titleToId; // Maps title to book ID for quick access
    uint public bookCount; // Total number of books

    // Events for logging
    event BookAdded(uint id, string title, string author);
    event BookBorrowed(string title);
    event BookReturned(string title);

    // Add a new book to the library
    function addBook(string memory _title, string memory _author) public {
        bookCount++;
        books[bookCount] = Book(bookCount, _title, _author, true);
        titleToId[_title] = bookCount; // Store book ID by title
        emit BookAdded(bookCount, _title, _author);
    }

    // Check if a book is available by title
    function checkAvailability(string memory _title) public view returns (bool) {
        uint bookId = titleToId[_title];
        require(bookId != 0, "Book does not exist."); // Ensure the book exists
        return books[bookId].available;
    }

    // Borrow a book by title
    function borrowBook(string memory _title) public {
        uint bookId = titleToId[_title];
        require(bookId != 0, "Book does not exist."); // Ensure the book exists
        require(books[bookId].available, "Book is not available.");
        
        books[bookId].available = false; // Mark the book as borrowed
        emit BookBorrowed(_title);
    }

    // Return a book by title
    function returnBook(string memory _title) public {
        uint bookId = titleToId[_title];
        require(bookId != 0, "Book does not exist."); // Ensure the book exists
        require(!books[bookId].available, "Book is already available.");

        books[bookId].available = true; // Mark the book as available again
        emit BookReturned(_title);
    }
}
