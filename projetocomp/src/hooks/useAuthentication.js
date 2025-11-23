import {db} from "../firebase/config";

import{
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    sendPasswordResetEmail, 
} from 'firebase/auth'

import { useState, useEffect } from 'react'

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 60; 

export const useAuthentication = () => {
    const [erro, setErro] = useState(null)
    const [loading, setLoading] = useState(null)

    const [tentativas, setTentativas] = useState(() => {
        const storedAttempts = localStorage.getItem('loginAttempts');
        return storedAttempts ? Number(storedAttempts) : 0;
    });
    const [isBlocked, setIsBlocked] = useState(() => {
        const storedBlockTime = localStorage.getItem('blockTimestamp');
        if (storedBlockTime) {
            const timeElapsed = Math.floor((Date.now() - Number(storedBlockTime)) / 1000);
            return timeElapsed < BLOCK_DURATION;
        }
        return false;
    });
    const [countdown, setCountdown] = useState(0);

    const [cancelled, setCancelled] = useState(false)
    const auth = getAuth();

    function checkCancelled(){
        if(cancelled){
            return;
        }
    }

    useEffect(() => {
        localStorage.setItem('loginAttempts', tentativas.toString());
    }, [tentativas]);

    useEffect(() => {
        let timer;
        
        if (isBlocked) {
            const storedBlockTime = localStorage.getItem('blockTimestamp');
            const blockStartTime = Number(storedBlockTime);
            const timePassed = Math.floor((Date.now() - blockStartTime) / 1000);
            const timeLeft = Math.max(0, BLOCK_DURATION - timePassed);
            
            setCountdown(timeLeft);

            if (timeLeft > 0) {
                timer = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            setIsBlocked(false);
                            setTentativas(0);
                            localStorage.removeItem('blockTimestamp');
                            localStorage.removeItem('loginAttempts');
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setIsBlocked(false);
                setTentativas(0);
                localStorage.removeItem('blockTimestamp');
                localStorage.removeItem('loginAttempts');
            }
        } else {
            setCountdown(0);
        }

        return () => clearInterval(timer);
    }, [isBlocked]);


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

        if (isBlocked) {
            setErro(`Tentativas excedidas! Aguarde ${countdown}s.`);
            return;
        }
        
        setLoading(true);
        setErro(null);
        
        try {
          await signInWithEmailAndPassword(auth, data.email, data.password);
          
          setTentativas(0);
          localStorage.removeItem('loginAttempts');
          
          setLoading(false); 
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

          setTentativas(prev => {
              const newAttempts = prev + 1;

              if (newAttempts >= MAX_ATTEMPTS) {
                  setIsBlocked(true);
                  localStorage.setItem('blockTimestamp', Date.now().toString());
                  return 0;
              }
              return newAttempts;
          });
        } finally {
            setLoading(false); 
        }
    }

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
        isBlocked,
        countdown,
    }
}