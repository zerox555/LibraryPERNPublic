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
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                {/* TODO: Remove this only for testing */}
                <li>
                    <Link to="/user">User</Link>
                </li>
            </ul>

    </nav>
}