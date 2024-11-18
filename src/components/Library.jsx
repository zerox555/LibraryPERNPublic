import { useState, useEffect } from "react";
import "../App.css";

export default function Library() {
    //declare list of stateful list 'books' and function 'setBooks' to update
    const [books, setBooks] = useState([])

    //get url for current env

    const urlGetAllBooks = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/books/" : "http://localhost:8080/api/books/"
    const urlDeleteBook = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/deletebook/" : "http://localhost:8080/api/deletebook/"
    const urlCreateBook = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/createbook/" : "http://localhost:8080/api/createbook/"
    const urlEditBook = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/editbook/" : "http://localhost:8080/api/editbook/"


    //define css
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
        <div style={{ display: "flex", justifyContent: "center" }}>

            <div style={{ textAlign: 'center' }}>
                <h1>Library</h1>
                {/* Table with books */}
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
                                <td style={mystyle}>{book.name}</td>
                                <td style={mystyle}>{book.author}</td>
                                <td style={mystyle}> {book.year_published}</td>
                                <td style={mystyle}> <form action={`${urlDeleteBook}`} method="post"><button id="book_id" name="book_id" value={`${book.book_id}`}>Delete</button></form></td>
                                <td style={mystyle}> <form action={`${urlEditBook}`} method="post"><button id="book_id" name="book_id" value={`${book.book_id}`}>Edit</button></form></td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Form to insert data */}
                <div style={{ borderStyle: "solid", marginTop: "10px",paddingTop: "10px", paddingBottom: "10px"}}>
                    <form action={`${urlCreateBook}`} method="post">
                        <label for="fname">Book Name:</label><br />
                        <input type="text" id="name" name="name" value="Pirates of the carribean" /><br />
                        <label for="lname">Book Author:</label><br />
                        <input type="text" id="author" name="author" value="J.K Rowling" /><br /><br />
                        <label for="lname">Year Published:</label><br />
                        <input type="number" id="year_published" name="year_published" value="1943" /><br /><br />
                        <input type="submit" value="Submit"></input>
                    </form>

                </div>

            </div>



        </div>
    )
}