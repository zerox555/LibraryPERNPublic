import "../styles.css"
import { Link } from "react-router-dom"

export default function Navbar({ loggedIn, token, setToken, setLoggedIn }) {
    return <nav className="nav">
        <Link to="/" className="site-title">Library Of Aeons</Link>
        <ul>
            <li>
                <Link to="/home">Home</Link>
            </li>
            <li>
                <Link to="/library">Library</Link>
            </li>
            {/* <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li> */}
            {loggedIn ? (
                <>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <button onClick={(e) => {
                            setToken("");
                            setLoggedIn(false)
                        }}

                        > logout</button>
                    </li>
                </>
            ) : (
                <>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                </>
            )}
            <li>
                <p1 style={{ color: loggedIn ? "green" : "red" }}>Logged in: {loggedIn ? "Yes" : "No"}</p1>
            </li>
            <li>
                <p1 style={{ width: "100px", display: "inline-block" }}>Token: {loggedIn ? token : ""}</p1>
            </li>
        </ul>

    </nav >
}