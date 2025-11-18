import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");

    const { login, erro: authErro, loading } = useAuthentication();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErro("");

        const user = {
            email,
            password,
        };

        const res = await login(user);

        console.log(res);
    };

    useEffect(() => {
        console.log(authErro);
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
            </form>
        </div>
    );
};

export default Login;