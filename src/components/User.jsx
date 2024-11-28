import { useState, useEffect } from "react";

export default function User() {

    //states
    const [users, setUsers] = useState([])

    //get url for current env
    const urlGetAllUsers = process.env.REACT_APP_WEB_DEPLOYMENT === "TRUE" ? "/api/users/" : "http://localhost:8080/api/users/"

    //only update if the value changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(urlGetAllUsers)
            console.log(process.env.REACT_APP_WEB_DEPLOYMENT);
            const json = await response.json()
            setUsers(json)
            console.log(users.length)
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user, index) => (
                    <li key={index} style = {{paddingBottom: '25px'}}>
                        <div>{user.name}</div>
                        <div>{user.password}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}