import { useState, useEffect } from "react";
import "../App.css";

export default function Library({loggedIn}) {

    //states
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(0)

    //get url for current env
    const urlGetAllBooks = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/books/" : "http://localhost:8080/api/books/"

    //only update if the value changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(urlGetAllBooks)
            console.log(process.env.REACT_APP_WEB_DEPLOYMENT);
            const json = await response.json()
            setBooks(json)
            setLoading(1)
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ textAlign: 'center' }}>
                <h1>Library</h1>
                {loading === 1 ? (
                    <BookTable setBooks={setBooks} books={books}></BookTable>) : (
                    <p>Loading books...</p>
                )
                }
                <SubmitBookDiv setBooks={setBooks}></SubmitBookDiv>
            </div>
        </div>

    )
}

function BookSearchBar({ setFilterText }) {
    return (
        <div>
            <td></td>
            <input
                style={{ width: "100%", height: "40px" }}
                type="text"
                placeholder="Search..."
                onChange={(e) => setFilterText(e.target.value)} />
        </div>
    )
}

function SubmitBookDiv({ setBooks }) {

    //get url for current env
    const urlCreateBook = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/createbook/" : "http://localhost:8080/api/createbook/"

    return (
        <div style={{ borderStyle: "solid", marginTop: "10px", paddingTop: "10px", paddingBottom: "10px" }}>
            <form
                onSubmit={async (e) => {
                    e.preventDefault(); // Prevent default form submission
                    const formData = new FormData(e.target);
                    const newBook = {
                        name: formData.get("name"),
                        author: formData.get("author"),
                        year_published: formData.get("year_published"),
                    };

                    try {
                        const response = await fetch(urlCreateBook, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(newBook),
                        });

                        if (response.ok) {
                            const createdBook = await response.json();
                            setBooks((prevBooks) => [...prevBooks, createdBook]);
                            alert("Book created successfully!");
                        } else {
                            alert("Failed to create book");
                        }
                    } catch (error) {
                        alert("Error creating book");
                    }
                }}
            >
                <label for="fname">Book Name:</label><br />
                <input type="text" id="name" name="name" defaultValue="Pirates of the carribean" /><br />
                <label for="lname">Book Author:</label><br />
                <input type="text" id="author" name="author" defaultValue="J.K Rowling" /><br /><br />
                <label for="lname">Year Published:</label><br />
                <input type="number" id="year_published" name="year_published" defaultValue="1943" /><br /><br />
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    )

}

function BookTable({ setBooks, books }) {

    //get path for current env
    const urlDeleteBook = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/deletebook/" : "http://localhost:8080/api/deletebook/"
    const urlEditBook = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/editbook/" : "http://localhost:8080/api/editbook/"

    //get current book being updated
    const [editableBook, setEditableBook] = useState(null);

    //Tracks which bookId is being edited
    const [editableBookId, setEditableBookId] = useState(null); // Tracks the ID of the book being edited

    const [filterText, setFilterText] = useState("")

    // Save the edited book
    const handleSave = async () => {
        try {
            const updatedBook = { ...editableBook };
            console.log(updatedBook);
            const response = await fetch(urlEditBook, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedBook),
            });

            if (response.ok) {
                setBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.book_id === updatedBook.book_id ? updatedBook : book
                    )
                );
                alert("Book updated successfully!");
            } else {
                alert("Failed to update book");
            }
        } catch (error) {
            alert("Error updating book");
        } finally {
            setEditableBookId(null); // Reset the editable state after saving
        }
    };

    // Handle changes in input fields
    const handleInputChange = (e, field) => {
        setEditableBook((prevState) => ({
            ...prevState,
            [field]: e.target.value,  // Update the specific field in editableBook
        }));
    };

    // Handle editing a book
    const handleEdit = (book) => {
        setEditableBookId(book.book_id); // Set the ID of the book being edited
        setEditableBook({
            name: book.name,
            author: book.author,
            year_published: book.year_published,
            book_id: book.book_id,
        });
    };

    // Cancel editing
    const handleCancel = () => {
        setEditableBookId(null); // Reset editable state
    };

    // Function to filter books based on filterText
    const getFilteredBooks = () => {
        console.log(books.length);
        if (books.length !== 0) {
            return books.filter((book) =>
                book.name.toLowerCase().includes(filterText.toString().toLowerCase())
            );
        } else {
            return books;
        }


    };

    const mystyle = {
        border: "1px solid black",
        borderCollapse: "collapse"
    }

    return (
        <form id="editForm" action={urlEditBook} method="post">
            <table style={mystyle}>
                <tbody>
                    <tr>
                        <td colSpan={6} style={{ padding: "10px" }}>
                            <BookSearchBar setFilterText={setFilterText}></BookSearchBar>
                        </td>
                    </tr>
                    <tr>
                        <th style={mystyle}>Book</th>
                        <th style={mystyle}>Author</th>
                        <th style={mystyle}>Year Published</th>
                        <th style={mystyle} colSpan={3}></th>
                    </tr>
                    {getFilteredBooks().map((book, index) => (
                        <tr key={index} style={{
                            paddingBottom: '25px'
                        }}>
                            <td style={mystyle}>
                                {editableBookId === book.book_id ? (
                                    <input
                                        type="text"
                                        value={editableBook.name}
                                        onChange={(e) => handleInputChange(e, "name")}
                                    />
                                ) : (
                                    book.name
                                )}
                            </td>
                            <td style={mystyle}>
                                {editableBookId === book.book_id ? (
                                    <input
                                        type="text"
                                        value={editableBook.author}
                                        onChange={(e) => handleInputChange(e, "author")}
                                    />
                                ) : (
                                    book.author
                                )}
                            </td>
                            <td style={mystyle}>
                                {editableBookId === book.book_id ? (
                                    <input
                                        type="text"
                                        value={editableBook.year_published}
                                        onChange={(e) => handleInputChange(e, "year_published")}
                                    />
                                ) : (
                                    book.year_published
                                )}
                            </td>
                            <td style={mystyle}>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            const response = await fetch(`${urlDeleteBook}`, {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({ book_id: book.book_id }),
                                            });

                                            if (response.ok) {
                                                setBooks((prevBooks) =>
                                                    prevBooks.filter((b) => b.book_id !== book.book_id)
                                                );
                                                alert("Book deleted successfully!");
                                            } else {
                                                alert("Failed to delete book");
                                            }
                                        } catch (error) {
                                            alert("Error deleting book");
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                            <input id="book_id" value={book.book_id} type="hidden"></input>
                            <td style={mystyle}>
                                {editableBookId === null ?
                                    (<button name="book_id" value={`${book.book_id}`} type="button" onClick={() => {
                                        handleEdit(book)
                                    }}>Edit</button>) :
                                    (<button name="book_id" value={`${book.book_id}`} type="button" onClick={() => {
                                        handleCancel()
                                    }}>Back</button>)}
                            </td>
                            <td style={mystyle}> <button name="book_id" value={`${book.book_id}`} type="button" onClick={handleSave}>Save</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </form>
    )
}