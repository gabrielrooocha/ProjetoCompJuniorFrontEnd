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
import CriarPost from './pages/CriarReview/CriarReview';
import Dashboard from './pages/Avaliacoes/Avaliacoes';
import MovieList from './pages/MovieList/MovieList';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'; // NOVO: Importa o componente


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
                            <Route path="/movielist" element={<MovieList/>}/>
                            <Route path="/sobre" element={<Sobre/>}/>
                            {/* Rotas de autenticação */}
                            <Route path="/login" element={!user ? <Login/> : <Navigate to="/" />}/>
                            <Route path="/registrar" element={!user ? <Registrar/> : <Navigate to="/" />}/>
                            <Route path="/forgotpassword" element={!user ? <ForgotPassword/> : <Navigate to="/" />}/> {/* NOVO: Rota de redefinição */}
                            {/* Rotas protegidas */}
                            <Route path="/posts/create" element={user ? <CriarPost/> : <Navigate to="/login"/>}/>
                            <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to="/login"/>}/>
                        </Routes>
                    </div>
                    <Footer/>
                </BrowserRouter>
            </AuthProvider>
        </div>
    );
}

export default App;