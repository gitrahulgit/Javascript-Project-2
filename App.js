class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI Class: Handles UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    // Adds book to list when one is typed in and submitted
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
        `;

        list.appendChild(row);
    }

    // Deletes a book when the delete button is clicked.
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    // Shows an alert
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    // Clears the fields once somehting is submitted
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}
// Store Class: Handles storage (local)
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add A Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent Actual submit
    e.preventDefault();

    // Get Form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields.', 'danger');
    } else {
        // Instatiate Book
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to Store
        Store.addBook(book);

        // Show Success message
        UI.showAlert(`${title} by ${author} added to list.`, 'success');

        // Clear Fields
        UI.clearFields();
    }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Delete the book
    UI.deleteBook(e.target);

    // Delete from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show Success message
    UI.showAlert(`${e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent} by ${e.target.parentElement.previousElementSibling.previousElementSibling.textContent} removed from list.`, 'success');
});