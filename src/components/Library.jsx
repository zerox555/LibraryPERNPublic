import { useState, useEffect } from "react";
import "../App.css";

export default function Library() {
    //declare list of stateful list 'books' and function 'setBooks' to update
    const [books, setBooks] = useState([])


    //get current book being updated
    const [editableBook, setEditableBook] = useState(null);

    //Tracks which bookId is being edited
    const [editableBookId, setEditableBookId] = useState(null); // Tracks the ID of the book being edited

    //get url for current env
    const urlGetAllBooks = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/books/" : "http://localhost:8080/api/books/"
    const urlDeleteBook = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/deletebook/" : "http://localhost:8080/api/deletebook/"
    const urlCreateBook = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/createbook/" : "http://localhost:8080/api/createbook/"
    const urlEditBook = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/editbook/" : "http://localhost:8080/api/editbook/"

    // Handle changes in input fields
    const handleInputChange = (e, field) => {
        setEditableBook((prevState) => ({
            ...prevState,
            [field]: e.target.value,  // Update the specific field in editableBook
        }));
    };

    // Save the edited book
    const handleSave = async () => {
        try {
            const updatedBook = { ...editableBook };
            console.log(updatedBook);
            const response = await fetch(`${urlEditBook}`, {
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

    const mystyle = {
        border: "1px solid black",
        borderCollapse: "collapse"
    }

    //only update if the value changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(urlGetAllBooks)
            console.log(process.env.REACT_APP_WEB_DEPLOYMENT);
            const json = await response.json()
            setBooks(json)

        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Provide table with books 
    return (


        // edit mode
        <div style={{ display: "flex", justifyContent: "center" }}>

            <div style={{ textAlign: 'center' }}>
                <h1>Library</h1>
                {/* Table with books */}
                <form id="editForm" action={`${urlEditBook}`} method="post">


                    <table style={mystyle}>
                        <tbody>
                            <tr>
                                <th style={mystyle}>Book</th>
                                <th style={mystyle}>Author</th>
                                <th style={mystyle}>Year Published</th>
                                <th style={mystyle}></th>
                            </tr>


                            {books.map((book, index) => (
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
                                    {/* <td style={mystyle}> <form action={`${urlDeleteBook}`} method="post"><button id="book_id" name="book_id" value={`${book.book_id}`}>Delete</button></form></td>
                                     */}
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
                                    <input id="book_id" value={`${book.book_id}`} type="hidden"></input>
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

                {/* Form to insert data */}
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
                                const response = await fetch(`${urlCreateBook}`, {
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

            </div>



        </div>

    )
}