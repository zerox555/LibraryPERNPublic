import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Library from './components/Library';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {
  return (
    <div className="container">
      <Router>
        <Navbar />

        <Routes>
          <Route path='/'> </Route>
          <Route path='/library' element={<Library />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </Router>
    </div>

  )
}

export default App;
