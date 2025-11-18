import styles from "./Sobre.module.css";

import { Link } from "react-router-dom";

const Sobre = () => {
  return (
    <div className={styles.about}>
      <h2>
        Sobre o site
      </h2>
      <p>
        Este projeto consiste em um site de posts voltados a filmes, com a capacidade de criar, deletar, editar e atualizar postagens, feito com React no Front-End, API The Movie Database e Firebase
        no back-end.
      </p>
      <Link to="/posts/create" className="btn">
        Criar post
      </Link>
    </div>
  );
};

export default Sobre;