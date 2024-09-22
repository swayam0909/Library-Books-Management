//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LibraryContract {
    struct Book {
        string title;
        string author;
        bool available;
    }

    mapping(uint => Book) public books;
    uint public bookCount;

    function addBook(string memory _title, string memory _author) public {
        books[bookCount] = Book(_title, _author, true);
        bookCount++;
    }

    function checkAvailability(uint _bookId) public view returns (bool) {
        return books[_bookId].available;
    }

    function borrowBook(uint _bookId) public {
        require(books[_bookId].available, "Book not available");
        books[_bookId].available = false;
    }
}
