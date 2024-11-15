import { useState, useEffect } from "react"


export default function Library() {
    //declare list of stateful list 'books' and function 'setBooks' to update
    const [ books, setBooks ] = useState([])

    //only update if the value changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:8080/api/books")
            const json = await response.json()
            setBooks(json)
        }
        fetchData()
    }, []);

    return (
        <div>
            <h1>Library</h1>
            <ul>
                {books.map((book, index) => (
                    <li key={index} style = {{paddingBottom: '25px'}}>
                        <div>{book.name}</div>
                        <div>{book.author}</div>
                        <div>{book.year_published}</div>

                    </li>
                ))}

            </ul>
  
            <ul>
                dsfsd
            </ul>
        </div>
    )
}