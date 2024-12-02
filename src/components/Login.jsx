import React, { useState } from "react";
import "./Login.css";

export default function Login({setLoggedIn,setToken}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const urlAuthUser = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/authuser/" : "http://localhost:8080/api/authuser/"
        try {
            const existingUser = {
                name: username,
                password: password
            };
            const response = await fetch(urlAuthUser, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(existingUser),
            });

            //get user auth boolean
            const { success, data: { token } } = await response.json();
            console.log(success);
            console.log(token);
            if (response.ok && success) {
                setLoggedIn(true);
                setToken(token);
                alert("User Logged in!");
            } else {
                alert("Failed to login user");
            }
        } catch (error) {

            console.log(error);
            alert("Error logging in user");
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-header">Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}