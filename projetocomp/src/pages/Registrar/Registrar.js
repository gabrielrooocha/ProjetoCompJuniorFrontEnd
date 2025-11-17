import React from "react";
import styles from "./Registrar.module.css";
import {useState, useEffect} from  'react';

const Registrar = () => {
    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [erro, setErro] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        setErro("");

        const user = {
            displayName,
            email,
            password
        }

        if(password != password2) {
            setErro("As senhas são diferentes. Tente novamente.")
            return
        }

        console.log(user);
    }


    return (
        <div className={styles.registrar}>
            <h1>Criar conta</h1>
            <p>Cadastre-se para ter acesso ao conteúdo completo.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Nome:</span>
                    <input 
                    type="text" 
                    name="displayName" 
                    required placeholder="Nome do usuário" 
                    value = {displayName}
                    onChange={(e)=>setDisplayName(e.target.value)}
                    />
                    <span>E-mail:</span>
                    <input
                    type="email"
                    name="email"
                    required placeholder="E-mail"
                    value = {email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                    <span>Senha:</span>
                    <input
                    type="password"
                    name="password"
                    required placeholder="Senha"
                    value = {password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    <span>Confirmação de senha:</span>
                    <input
                    type="password"
                    name="confirmPassword"
                    required placeholder="Confirme sua senha"
                    value = {password2}
                    onChange={(e)=>setPassword2(e.target.value)}
                    />
                </label>
                <button className="btn">Cadastrar</button>
                {erro && <p className="erro">{erro}</p>}
            </form>
        </div>
    );
};

export default Registrar;