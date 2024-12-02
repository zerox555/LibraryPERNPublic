import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Library from './components/Library';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import { useState } from 'react';

function App() {
  const [loggedIn,setLoggedIn] = useState(false)
  const [token,setToken] = useState("")

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
        </Routes>
      </Router>
    </div>

  )
}

export default App;
