import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Link } from "react-router-dom"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");

    const { 
        login, 
        erro: authErro, 
        loading,
        isBlocked, 
        countdown 
    } = useAuthentication();

    useEffect(() => {
        const storedEmail = localStorage.getItem('lastUsedEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (isBlocked) {
            setErro(`Tentativas excedidas! Aguarde ${countdown}s`);
            return;
        }
    
        setErro("");

        const user = {
            email,
            password,
        };

        localStorage.setItem('lastUsedEmail', email);

        await login(user);
    };
    

    useEffect(() => {
        if (authErro) {
            setErro(authErro);
        }
    }, [authErro]);

    useEffect(() => {
        if (isBlocked) {
            setErro(`Tentativas excedidas! Bloqueado por ${countdown} segundos.`);
        } else if (countdown === 0 && !authErro) {
            setErro(''); 
        }
    }, [isBlocked, countdown, authErro]);

    const isButtonDisabled = loading || isBlocked;
    const buttonText = isBlocked
    ? `Bloqueado: ${countdown}s`
    : (loading ? "Aguarde..." : "Entrar");


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
                <button className="btn" disabled={isButtonDisabled}>
                    {buttonText}
                </button>

                {erro && <p className="erro">{erro}</p>}

                <p className={styles.forgot_password}>
                    <Link to="/forgotpassword">Esqueceu sua senha?</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;