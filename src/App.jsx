import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Library from './components/Library';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';

function App() {


  return (
    <div className="container">
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/home" />}></Route>
          <Route path='/library' element={<Library />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </Router>
    </div>

  )
}

export default App;
