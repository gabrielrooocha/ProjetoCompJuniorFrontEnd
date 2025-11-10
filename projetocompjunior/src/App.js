import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import Principal from './pages/Principal/Principal';
import Sobre from './pages/Sobre/Sobre';
import Navegacao from './components/Navegacao';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navegacao/>
      <div className = "container">
        <Routes>
          <Route path="/" element={<Principal/>}/>
          <Route path='/sobre' element={<Sobre/>}/>
        </Routes>
      </div>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
