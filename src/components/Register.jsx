import React, { useState } from "react";
import "./Login.css";


export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add register logic here
        const urlCreateUser = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/createuser/" : "http://localhost:8080/api/createuser/"
        //hashing

        try {
            const newUser = {
                name: username,
                password: password
            };
            const response = await fetch(urlCreateUser, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                // const createdBook = await response.json();
                // setBooks((prevBooks) => [...prevBooks, createdBook]);
                alert("User created successfully!");
                console.log("Logging in with", username, password);

            } else {
                alert("Failed to create user");
            }
        } catch (error) {
            console.log(error)
            alert("Error creating user");
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-header">Register</h1>
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