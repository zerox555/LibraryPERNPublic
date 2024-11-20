import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Library from './components/Library';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="container">
      <Router>
        <Navbar />

        <Routes>
          <Route path='/'> </Route>
          <Route path='/library' element={<Library />} />
        </Routes>
      </Router>
    </div>

  )
}

export default App;
