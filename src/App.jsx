import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Library from './components/Library';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import BookInfo from "./components/BookInfo";
import { useState } from 'react';

function App() {
  const [loggedIn,setLoggedIn] = useState(false)
  const [token,setToken] = useState("")

  console.log("This log should appear in the console");
  return (
    <div className="container">
      <Router>
        <Navbar loggedIn={loggedIn} token={token} setToken={setToken} setLoggedIn={setLoggedIn}/>

        <Routes>
          <Route path="/" element={<Navigate to="/home" />}></Route>
          <Route path='/library' element={<Library token={token} />} />
          <Route path='/login' element={<Login setLoggedIn={setLoggedIn} setToken={setToken}/>} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />
          <Route path="/book-info/:bookName" element={<BookInfo />} />
        </Routes>
      </Router>
    </div>

  )
}

export default App;
