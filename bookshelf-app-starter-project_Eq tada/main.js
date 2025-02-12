// Do your work here...
// console.log('Hello, world!');

// membuat key dan varibel untuk menampung array data buku
const STORAGE_KEY = 'BOOKSHELF_EQDEV';
let books = [];

// memuat data dari local storage saat pertama kali dibuka
window.addEventListener('load', function () {
    const serializedBooks = localStorage.getItem(STORAGE_KEY);
    if (serializedBooks) {
        books = JSON.parse(serializedBooks);
    }

    renderBooks();
});

// ======= membuat fungsi-fungsi yang diperlukan ============
// fungsi untuk menyimpan data ke local storage, tapi kita harus cek apakah browser mensupport atau tidak dengan
const SAVED_EVENT = 'saved-bookshelf';
function isStorageExist() {
    if (typeof Storage === 'undefined') {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }

    return true;
}

function saveBooks() {
    if (isStorageExist()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

// fungsi untuk mendapatkan timestamp
function generatedID() {
    return +new Date();
}

// fungsi untuk menambahkan buku ke dalam array
function createBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year: Number(year),
        isComplete,
    }
}

// fungsi untuk menambahkan buku ke dalam array
function addBook(title, author, year, isComplete) {
    const bookId = generatedID();
    const bookObject = createBookObject(bookId, title, author, year, isComplete);
    books.push(bookObject);

    
    saveBooks();
    renderBooks();
}


// fungsi render books ke dalam rak
function renderBooks() {
    const uncompletedBooks = document.getElementById('incompleteBookList');
    const completedBooks = document.getElementById('completeBookList');

    uncompletedBooks.innerText = "";
    completedBooks.innerText = "";

    books.forEach((book) => {
        const bookElement = makeTodo(book);

        if (book.isComplete) {
            completedBooks.appendChild(bookElement);
        } else {
            uncompletedBooks.appendChild(bookElement);
        }
    });
}

// fungsi makeTodo(book)
function makeTodo(book) {
    const { id, title, author, year, isComplete } = book;

    const textTitle = document.createElement('h2')
    textTitle.setAttribute("data-testid", "bookItemTitle")
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.setAttribute("data-testid", "bookItemAuthor")
    textAuthor.innerText = `Penulis : ${author}`;

    const textYear = document.createElement('p');
    textYear.setAttribute("data-testid", "bookItemYear")
    textYear.innerText = `Tahun : ${year}`;

    //masukan textTittle, textAuthor, textYear ke dalam div
    // const textContainer = document.createElement('div');
    // textContainer.classList.add('inner');
    // textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.setAttribute("data-testid", "bookItem");
    container.setAttribute("data-bookid", id);
    container.append(textTitle, textAuthor, textYear);


    if (isComplete) {
        const undoButton = document.createElement("button");
        undoButton.setAttribute("data-testid", "undo-button");
        undoButton.innerText = "Belum Selesai";
        undoButton.addEventListener("click", function () {
            toggleBookStatus(book.id);
        });

        const trashButton = document.createElement("button");
        trashButton.setAttribute("data-testid", "bookItemDeleteButton");
        trashButton.innerText = "Hapus Buku";
        trashButton.addEventListener("click", function () {
            deleteBook(book.id);
        });


        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement("button");
        checkButton.setAttribute("data-testid", "bookItemIsCompleteButton");
        checkButton.innerText = "Selesai Baca";
        checkButton.addEventListener("click", function () {
            toggleBookStatus(book.id);
        });

        container.append(checkButton)
    }

    return container;
}


// fungsi toogleBookStatus() yang berfungsi memindahkan buku antar rak
function toggleBookStatus(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;

        saveBooks();
        renderBooks();
    }
}

// fungsi deleteBook() untuk menghapus buku
function deleteBook(bookId) {
    books = books.filter((book) => book.id !== bookId);
    saveBooks();
    renderBooks();
}



// ====== event listener ======
// Event Listener untuk menangani form tambah buku
const bookForm = document.getElementById("bookForm");
bookForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);
    bookForm.reset();


});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
});



// sekarang saya akan membuaat fitur search
// fungsi nya dulu yaa
function searchBook(query) {
    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()));
    renderFilteredBooks(filteredBooks);
}

// fungsi renderFilteredBook()
function renderFilteredBooks(filteredBooks) {
    const uncompletedBookList = document.getElementById('incompleteBookList');
    const completedBookList = document.getElementById('completeBookList');

    uncompletedBookList.innerText = "";
    completedBookList.innerText = "";

    filteredBooks.forEach((book) => {
        const bookElement = makeTodo(book);

        if (book.isComplete) {
            completedBookList.appendChild(bookElement);
        } else {
            uncompletedBookList.appendChild(bookElement);
        }

    })
}


// event listenir untuk search
const searchForm = document.getElementById('searchBook');
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const query = document.getElementById("searchBookTitle").value;
    searchBook(query);
})