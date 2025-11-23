# CINE SITE 🎬

> Uma plataforma moderna para descobrir filmes, visualizar destaques e compartilhar suas próprias avaliações e notas com a comunidade.

---

## 💻 Tecnologias Utilizadas

Este projeto front-end foi desenvolvido com **React.js** e integra-se com serviços externos para autenticação, banco de dados e dados de filmes.

* **Frontend:** React.js (com hooks e componentes funcionais)
* [cite_start]**Roteamento:** React Router DOM [cite: 2093]
* **Estilização:** CSS Modules
* [cite_start]**Backend & Banco de Dados:** Google Firebase (Authentication e Firestore) [cite: 2342-2562]
* [cite_start]**Integração Externa:** The Movie Database (TMDB) API para dados de filmes (busca, destaques e recomendações) 
* [cite_start]**Requisições HTTP:** Axios [cite: 2564]

---

## ✨ Funcionalidades Principais

O CineSITE oferece uma experiência completa para entusiastas de cinema, combinando recursos de um portal de filmes com uma rede social de avaliações:

### 🍿 Filmes & Descoberta
* [cite_start]**Busca de Filmes:** Pesquisa por filmes na base de dados do TMDB [cite: 2020-2027, 2625].
* [cite_start]**Destaques e Recomendações:** Exibição de filmes populares e recomendações dinâmicas de diferentes gêneros (Ação, Comédia, Drama, Romance, etc.) [cite: 2567-2612].
* [cite_start]**Exibição de Dados:** Mostra título, pôster, gênero principal e nota média do TMDB para cada filme [cite: 2073-2087].

### 📝 Avaliações de Usuários
* [cite_start]**Criação de Avaliações:** Usuários logados podem selecionar um filme e publicar suas próprias notas (0 a 10) e avaliações de texto[cite: 2124].
* [cite_start]**Listagem de Reviews:** Exibe as avaliações criadas, com informações como título do filme, criador, tags e data [cite: 2149-2159, 2240].
* [cite_start]**Gestão de Reviews:** No painel do usuário, é possível **Editar** a nota e o conteúdo da avaliação ou **Deletá-la** permanentemente [cite: 2172-2313].

### 🔒 Autenticação e Segurança
* [cite_start]**Cadastro e Login:** Sistema de autenticação completo com controle de erros [cite: 2362-2416].
* [cite_start]**Controle de Acesso:** Navegação condicional (por exemplo, "Nova Avaliação" só aparece para usuários logados) [cite: 2111-2138].
* [cite_start]**Redefinição de Senha:** Funcionalidade para solicitar um link de redefinição de senha via e-mail [cite: 2417-2439].

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento.

### 1. Pré-requisitos

Certifique-se de ter o **Node.js** e o **npm** (ou yarn) instalados.

### 2. Instalação

Clone o repositório e instale as dependências do projeto:

```bash
# Clone o repositório (substitua pela URL real)
git clone [URL_DO_SEU_REPOSITÓRIO]
cd cinesite

# Instale as dependências
npm install
# ou
yarn install

# .env (exemplo de variáveis que devem ser configuradas)
REACT_APP_FIREBASE_API_KEY="[SUA_API_KEY_FIREBASE]"
REACT_APP_FIREBASE_AUTH_DOMAIN="[SEU_AUTH_DOMAIN]"
REACT_APP_FIREBASE_PROJECT_ID="[SEU_PROJECT_ID]"
REACT_APP_FIREBASE_STORAGE_BUCKET="[SEU_STORAGE_BUCKET]"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="[SEU_SENDER_ID]"
REACT_APP_FIREBASE_APP_ID="[SEU_APP_ID]"