import {db} from "../firebase/config";

import{
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    sendPasswordResetEmail, // Importado a função de redefinição
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
          setLoading(false); // Adicionado para garantir que o loading seja falso no sucesso
        } catch (error) {
          let systemErrorMessage;

          if (error.message.includes("user-not-found")) {
            systemErrorMessage = "Usuário não encontrado.";
          } else if (error.message.includes("wrong-password")) {
            systemErrorMessage = "Senha incorreta.";
          } else {
            systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
          }
          
          setErro(systemErrorMessage);
        } finally {
            setLoading(false); // Garante que o loading seja falso após a tentativa
        }
    }

    // Função para enviar link de redefinição de senha
    const sendPasswordReset = async (email) => {
        checkCancelled();
        setLoading(true);
        setErro(null);
        
        try {
            await sendPasswordResetEmail(auth, email);
            setLoading(false);
            return true;
        } catch (error) {
            let systemErrorMessage;

            if (error.message.includes("user-not-found")) {
                systemErrorMessage = "E-mail não cadastrado em nossa base de dados.";
            } else if (error.message.includes("missing-email")) {
                systemErrorMessage = "Por favor, preencha o campo de e-mail.";
            } else {
                systemErrorMessage = "Ocorreu um erro ao enviar o link. Tente novamente mais tarde.";
            }
            
            setErro(systemErrorMessage);
            setLoading(false);
            return false;
        }
    };


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
        sendPasswordReset, 
    }
}