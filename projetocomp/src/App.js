import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';


import { useState, useEffect} from "react";
import { useAuthentication } from './hooks/useAuthentication';
import { AuthProvider } from './hooks/AuthContext';

import Principal from './pages/Principal/Principal';
import Sobre from './pages/Sobre/Sobre';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login/Login';
import Registrar from './pages/Registrar/Registrar';
import CriarPost from './pages/CriarPost/CriarPost';
import Dashboard from './pages/Dashboard/Dashboard';


function App() {

  const [user, setUser] = useState(undefined)
  const {auth} = useAuthentication()

  const loadingUser = user === undefined

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
  }, [auth])

  if(loadingUser){
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <AuthProvider value = {{user}}>
        <BrowserRouter>
        <Navbar />
          <div className = "container">
            <Routes>
            <Route path="/" element={<Principal/>}/>
            <Route path="/sobre" element={<Sobre/>}/>
            <Route path="/login" element={!user ? <Login/> : <Navigate to="/" />}/>
            <Route path="/registrar" element={!user ? <Registrar/> : <Navigate to="/" />}/>
            <Route path="/posts/create" element={user ? <CriarPost/> : <Navigate to="/login"/>}/>
            <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to="/login"/>}/>
            {}
             </Routes>
            </div>
          <Footer/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;