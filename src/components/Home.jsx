import { Link } from "react-router-dom"


export default function Home() {
    return <div> 
        <main>
            <h1>Welcome to the library of Aeons</h1>
            <p1>Enjoy our selection of books</p1>
            <br></br>
            <Link to="/library">Go</Link>
        </main>
    </div>
}