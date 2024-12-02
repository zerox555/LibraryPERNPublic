import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Library from './components/Library';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import User from './components/User';
import Register from './components/Register';
import { useState } from 'react';

function App() {
  const [loggedIn,setLoggedIn] = useState(false)

  return (
    <div className="container">
      <Router>
        <Navbar loggedIn={loggedIn}/>

        <Routes>
          <Route path="/" element={<Navigate to="/home" />}></Route>
          <Route path='/library' element={<Library />} />
          <Route path='/login' element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />
          <Route path='/user' element ={<User/>}/>
        </Routes>
      </Router>
    </div>

  )
}

export default App;
