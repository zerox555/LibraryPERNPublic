import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Library({ token }) {

    // States
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(0)

    // Get current env URL
    const urlGetAllBooks = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/books/" : "http://localhost:8080/api/books/"

    // Only update if the value changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(urlGetAllBooks, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
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
                {token === "" ? (
                    <p>You need to be logged in first!</p>
                ) : (
                    <>
                        {loading === 1 ? (
                            <BookTable setBooks={setBooks} books={books} token={token}></BookTable>) : (
                            <p>Loading books...</p>
                        )
                        }
                        <SubmitBookDiv setBooks={setBooks} token={token}></SubmitBookDiv>
                    </>
                )}

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

function SubmitBookDiv({ setBooks, token }) {

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
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(newBook),
                        });

                        if (response.ok) {
                            const createdBook = await response.json();
                            setBooks((prevBooks) => [...prevBooks, createdBook]);
                            alert("Book created successfully!");
                        } else {
                            const errorResponse = await response.json();
                            alert(errorResponse.message);
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

function BookTable({ setBooks, books, token }) {
    const [editableBook, setEditableBook] = useState(null);
    const [editableBookId, setEditableBookId] = useState(null);
    const [filterText, setFilterText] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const entriesPerPage = 50; // Number of entries per page
    const navigate = useNavigate(); // Initialize useNavigate

    const mystyle = {
        border: "1px solid black",
        borderCollapse: "collapse",
    };

    const handleSave = async () => {
        // Save logic here
    };

    const handleInputChange = (e, field) => {
        setEditableBook((prevState) => ({
            ...prevState,
            [field]: e.target.value,
        }));
    };

    const handleEdit = (book) => {
        setEditableBookId(book.book_id);
        setEditableBook({
            name: book.name,
            author: book.author,
            year_published: book.year_published,
            book_id: book.book_id,
        });
    };

    const handleCancel = () => {
        setEditableBookId(null);
    };

    const getFilteredBooks = () => {
        return books.filter((book) =>
            book.name.toLowerCase().includes(filterText.toLowerCase())
        );
    };

    const filteredBooks = getFilteredBooks();
    const totalPages = Math.ceil(filteredBooks.length / entriesPerPage);

    // Calculate the books to display for the current page
    const paginatedBooks = filteredBooks.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    return (
        <form id="editForm">
            <table style={mystyle}>
                <tbody>
                    <tr>
                        <td colSpan={7} style={{ padding: "10px" }}>
                            <BookSearchBar setFilterText={setFilterText}></BookSearchBar>
                        </td>
                    </tr>
                    <tr>
                        <th style={mystyle}>Book</th>
                        <th style={mystyle}>Author</th>
                        <th style={mystyle}>Year Published</th>
                        <th style={mystyle} colSpan={4}></th>
                    </tr>
                    {paginatedBooks.map((book, index) => (
                        <tr key={index}>
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
                                        // Delete logic here
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                            <td style={mystyle}>
                                {editableBookId === book.book_id ? (
                                    <button type="button" onClick={handleCancel}>
                                        Back
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => handleEdit(book)}>
                                        Edit
                                    </button>
                                )}
                            </td>
                            <td style={mystyle}>
                                <button type="button" onClick={handleSave}>
                                    Save
                                </button>
                            </td>
                            <td style={mystyle}>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/book-info/${book.name}`)}
                                >
                                    More Info
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    Previous
                </button>
                <span style={{ margin: "0 10px" }}>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                    Next
                </button>
            </div>
        </form>
    );
}