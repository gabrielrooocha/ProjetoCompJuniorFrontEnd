import styles from "../Login/Login.module.css"; 
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Link } from "react-router-dom"; 

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [erro, setErro] = useState("");
    const [message, setMessage] = useState("");

    const { sendPasswordReset, erro: authErro, loading } = useAuthentication();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErro("");
        setMessage("");

        if (!email) {
            setErro("Por favor, insira seu e-mail.");
            return;
        }

        const success = await sendPasswordReset(email);

        if (success) {
            setMessage(
                "Link de redefinição enviado! Verifique sua caixa de entrada e o spam para redefinir sua senha."
            );
        }
    };

    useEffect(() => {
        if (authErro) {
            setErro(authErro);
        }
    }, [authErro]);

    return (
        <div className={styles.login}>
            <h1>Esqueceu a Senha</h1>
            <p>Informe o e-mail cadastrado para receber o link de redefinição.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>E-mail:</span>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Seu e-mail cadastrado"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </label>

                {!loading && <button className="btn">Enviar Link</button>}
                {loading && (
                    <button className="btn" disabled>
                        Aguarde...
                    </button>
                )}

                {message && <p className="success">{message}</p>}
                {erro && <p className="erro">{erro}</p>}
                
                {/* Botão para voltar à tela de Login */}
                <p style={{ marginTop: '1.5em' }}>
                    <Link to="/login" className="btn btn-outline">Voltar ao Login</Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;