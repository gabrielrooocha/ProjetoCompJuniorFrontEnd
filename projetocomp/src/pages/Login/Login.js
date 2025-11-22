import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Link } from "react-router-dom"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");

    const { login, erro: authErro, loading } = useAuthentication();

    useEffect(() => {
        const storedEmail = localStorage.getItem('lastUsedEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErro("");

        const user = {
            email,
            password,
        };

        localStorage.setItem('lastUsedEmail', email);

        const res = await login(user);
    };
    

    useEffect(() => {
        if (authErro) {
            setErro(authErro);
        }
    }, [authErro]);

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
                {!loading && <button className="btn">Entrar</button>}
                {loading && (
                    <button className="btn" disabled>
                        Aguarde...
                    </button>
                )}
                {erro && <p className="erro">{erro}</p>}

                <p className={styles.forgot_password}>
                    <Link to="/forgotpassword">Esqueceu sua senha?</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;