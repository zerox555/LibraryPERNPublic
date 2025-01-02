import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookInfo() {
    const { bookName } = useParams(); // Get book name from URL params
    const [bookData, setBookData] = useState(null);

    useEffect(() => {
        const fetchBookInfo = async () => {
            const response = await fetch(`https://openlibrary.org/search.json?q=${bookName}`);
            const data = await response.json();
            setBookData(data.docs[0]); // Set the first result
        };

        fetchBookInfo();
    }, [bookName]);

    return (
        <div>
            <h1>Book Information</h1>
            {bookData ? (
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
