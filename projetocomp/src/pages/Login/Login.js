import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Link } from "react-router-dom"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");
    const [tentativas, setTentativas] = useState(0);
    const [isBlockedLocal, setIsBlockedLocal] = useState(false);
    const [countdownLocal, setCountdownLocal] = useState(60);


    // NOVO: Importa os estados isBlocked e countdown
    const { 
        login, 
        erro: authErro, 
        loading,
        isBlocked, // Estado de bloqueio
        countdown // Contador regressivo
    } = useAuthentication();

    useEffect(() => {
        const storedEmail = localStorage.getItem('lastUsedEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        let timer;
    
        if (isBlockedLocal) {
            timer = setInterval(() => {
                setCountdownLocal((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsBlockedLocal(false);
                        setTentativas(0);
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    
        return () => clearInterval(timer);
    }, [isBlockedLocal]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (isBlockedLocal) {
            setErro(`Tentativas excedidas! Aguarde ${countdownLocal}s`);
            return;
        }
    
        setErro("");

        const user = {
            email,
            password,
        };

        localStorage.setItem('lastUsedEmail', email);

        await login(user);

        // Se houve erro do backend — conta tentativa
        if (authErro) {
            setTentativas((prev) => {
            const novas = prev + 1;

            if (novas >= 3) {
                setIsBlockedLocal(true);
                return 0;
            }

            return novas;
            });
        }
    };
    

    useEffect(() => {
        if (authErro) {
            setErro(authErro);
        }
    }, [authErro]);

    // NOVO: Monitora o estado de bloqueio e atualiza a mensagem de erro/bloqueio
    useEffect(() => {
        if (isBlocked) {
            setErro(`Tentativas excedidas! Bloqueado por ${countdown} segundos.`);
        } else if (countdown === 0 && !authErro) {
             // Limpa o erro de bloqueio quando o contador zera e não há outro erro
            setErro(''); 
        }
    }, [isBlocked, countdown, authErro]);

    // NOVO: Variável para controlar se o botão deve estar desabilitado
    const isButtonDisabled = loading || isBlocked || isBlockedLocal;
    // NOVO: Texto do botão
    const buttonText = isBlockedLocal
    ? `Bloqueado: ${countdownLocal}s`
    : (isBlocked ? `Bloqueado: ${countdown}s` : (loading ? "Aguarde..." : "Entrar"));


    return (
        <div className={styles.login}>
            <h1>Entrar</h1>
            <p>Faça o login para poder utilizar o sistema</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>E-mail:</span>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="E-mail do usuário"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </label>
                <label>
                    <span>Senha:</span>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Insira a senha"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </label>
                {/* NOVO: Usa a variável isButtonDisabled e buttonText */}
                <button className="btn" disabled={isButtonDisabled}>
                    {buttonText}
                </button>

                {/* Removidos os condicionais de loading, pois o novo botão já lida com todos os estados */}
                {erro && <p className="erro">{erro}</p>}

                <p className={styles.forgot_password}>
                    <Link to="/forgotpassword">Esqueceu sua senha?</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;