import "../styles.css"
import { Link } from "react-router-dom"
import Library from "./Library"

export default function Navbar() {
    return <nav className="nav">
            <Link to="/" className="site-title">Library Of Aeons</Link>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/library">Library</Link>
                </li>
                <li>
                    <Link to="/">Placeholder 1</Link>
                </li>
            </ul>

    </nav>
}