import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navegacao.module.css"

const Navegacao = () => {
    return
        <nav>
            <li>
                <NavLink to = "/">
                    Principal
                </NavLink>
                <NavLink to = "/">
                    Sobre
                </NavLink>
            </li>
        </nav>
};

export default Navegacao;