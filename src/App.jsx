import './App.css';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Library from './components/Library';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';

function App() {
  //login state
  const [loggedIn, setLoggedIn] = useState(0)

  return (
    <div className="container">
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/home" />}></Route>
          {/* If not logged in redirect to the login page */}

          {/* {loggedIn === 1 ? (
             />
          ) : } */}
          {/* <Route path='/library' element={<Navigate to="/login" />}> </Route> */}
          <Route path='/library' element={<Library />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </Router>
    </div>

  )
}

export default App;
