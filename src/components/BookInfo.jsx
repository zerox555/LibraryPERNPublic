import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookInfo() {
    const { bookName } = useParams(); // Get book name from URL params
    const [bookData, setBookData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("Loading...");

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
        <div style={{ textAlign: "center", margin: "20px" }}>
            <h2>Book Information</h2>
            {bookData ? (
                <table style={{ margin: "0 auto", borderCollapse: "collapse", border: "1px solid #ccc" }}>
                    <tbody>
                        <tr>
                            <td style={tableCellStyle}><b>Title</b></td>
                            <td style={tableCellStyle}>{bookData.title}</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}><b>Author(s)</b></td>
                            <td style={tableCellStyle}>{bookData.author_name?.join(", ") || "N/A"}</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}><b>First Published Year</b></td>
                            <td style={tableCellStyle}>{bookData.first_publish_year || "N/A"}</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}><b>Languages</b></td>
                            <td style={tableCellStyle}>{bookData.language?.join(", ") || "N/A"}</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}><b>E Book available on openlibrary?</b></td>
                            <td style={tableCellStyle}>{bookData.ebook_access ? bookData.ebook_access : "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>{errorMessage}</p>
            )}
        </div>
    );
}

const tableCellStyle = {
    border: "1px solid #ccc",
    padding: "8px 12px",
    textAlign: "left",
};