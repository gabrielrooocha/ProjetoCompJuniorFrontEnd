import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import Principal from './pages/Principal/Principal';
import Sobre from './pages/Sobre/Sobre';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login/Login';
import Registrar from './pages/Registrar/Registrar';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
      <div className = "container">
        <Routes>
          <Route path="/" element={<Principal/>}/>
          <Route path='/sobre' element={<Sobre/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/registrar' element={<Registrar/>}/>
        </Routes>
      </div>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;