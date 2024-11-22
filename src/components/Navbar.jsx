import "../styles.css"
import { Link } from "react-router-dom"

export default function Navbar() {
    return <nav className="nav">
            <Link to="/" className="site-title">Library Of Aeons</Link>
            <ul>
                <li>
                    <Link to="/home">Home</Link>
                </li>
                <li>
                    <Link to="/library">Library</Link>
                </li>
            </ul>

    </nav>
}