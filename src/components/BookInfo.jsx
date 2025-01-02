import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookInfo() {
    const { bookName } = useParams(); // Get book name from URL params
    const [bookData, setBookData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchBookInfo = async () => {
            try {
                const response = await fetch(`https://openlibrary.org/search.json?q=${bookName}`);
                const data = await response.json();

                if (data.docs && data.docs.length > 0) {
                    setBookData(data.docs[0]); // Set the first result
                } else {
                    setErrorMessage("No data found for the given book name.");
                }
            } catch (error) {
                setErrorMessage("An error occurred while fetching book information.");
            }
        };

        fetchBookInfo();
    }, [bookName]);

    return (
        <div>
            <h1>Book Information</h1>
            {errorMessage ? (
                <p style={{ color: "red" }}>{errorMessage}</p>
            ) : bookData ? (
                <div>
                    <p><strong>Title:</strong> {bookData.title}</p>
                    <p><strong>Author:</strong> {bookData.author_name?.join(", ")}</p>
                    <p><strong>First Published:</strong> {bookData.first_publish_year}</p>
                </div>
            ) : (
                <p>Loading book information...</p>
            )}
        </div>
    );
}
