import {db} from "../firebase/config";

import{
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth'

import { useState, useEffect } from 'react'

export const useAuthentication = () => {
    const [erro, setErro] = useState(null)
    const [loading, setLoading] = useState(null)

    const [cancelled, setCancelled] = useState(false)
    const auth = getAuth();

    function checkCancelled(){
        if(cancelled){
            return;
        }
    }

    const createUser = async (data) => {
        checkCancelled()
        setLoading(true)
        setErro(null)

        try{
            const {user} = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            )

            await updateProfile(user, {
                displayName: data.displayName
            });

            setLoading(false)

            return user

        } catch(erro){
            console.log(erro.message)
            console.log(typeof erro.message)

            
        let systemErrorMessage;

        if (erro.message.includes("Password")) {
          systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
        } else if (erro.message.includes("email-already")) {
          systemErrorMessage = "E-mail já cadastrado.";
        } else {
          systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
        }

        setLoading(false)
        setErro(systemErrorMessage)
        }

    };

    const logout = () => {
        checkCancelled();
        signOut(auth)
    }

    const login = async (data) => {
        checkCancelled();
    
        setLoading(true);
        setErro(false);
    
        try {
          await signInWithEmailAndPassword(auth, data.email, data.password);
        } catch (error) {
          console.log(erro.message);
          console.log(typeof erro.message);
          console.log(erro.message.includes("user-not"));
    
          let systemErrorMessage;
    
          if (erro.message.includes("user-not-found")) {
            systemErrorMessage = "Usuário não encontrado.";
          } else if (erro.message.includes("wrong-password")) {
            systemErrorMessage = "Senha incorreta.";
          } else {
            systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
          }
    
          console.log(systemErrorMessage);
    
          setErro(systemErrorMessage);
        }
    }

    useEffect(() => {
        return() => setCancelled(true);
    }, []);
    
    return{
        auth,
        createUser,
        erro,
        loading,
        logout,
        login,
    }
}