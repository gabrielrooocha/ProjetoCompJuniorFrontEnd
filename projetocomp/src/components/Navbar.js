import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import { useAuthValue } from "../hooks/AuthContext";
import styles from "./Navbar.module.css";

const Navbar = () => {

    const {user} = useAuthValue();
    const {logout} = useAuthentication();

    return (<nav className={styles.navbar}>
        <NavLink to="/" className={styles.brand}>
            CINE <span>SITE</span>
      </NavLink>
        <ul className={styles.links_list}>
            <li>
                <NavLink to="/" className = {({ isActive}) => (isActive ? styles.active : "")}>🔍︎</NavLink>
           </li>
           <li>
                <NavLink to="/movielist" className = {({ isActive}) => (isActive ? styles.active : "")}>DESTAQUES</NavLink>
           </li>

           {!user && (
            <>
                <li>
                    <NavLink to="/login" className = {({ isActive}) => (isActive ? styles.active : "")}>ENTRAR</NavLink>
                </li>
               <li>
                    <NavLink to="/registrar" className = {({ isActive}) => (isActive ? styles.active : "")}>CADASTRAR</NavLink>
                </li>
            </>
           )}

           {user && (
            <>
                <li>
                   <NavLink to="/posts/create" className = {({ isActive}) => (isActive ? styles.active : "")}>NOVA AVALIAÇÃO</NavLink>
                </li>
                <li>
                <NavLink to="/dashboard" className = {({ isActive}) => (isActive ? styles.active : "")}>PARA VOCÊ</NavLink>
                </li>
            </>
           )}

            <li>
                <NavLink to="/Sobre" className = {({ isActive}) => (isActive ? styles.active : "")}>SOBRE</NavLink>
            </li>
            {user && (
                <li>
                    <button onClick={logout}>SAIR</button>
                </li>
            )}
       </ul>
    </nav>
    );
};

export default Navbar;