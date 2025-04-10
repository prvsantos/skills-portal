🚧 Projeto em construção... 🛠️
---
# Código completo do Portal de Competências
---
## Estrutura do Projeto
```pgsql
skills-portal/
|
|-- backend/
|   |-- server.js
|   |-- database.js
|   |-- auth.js
|   |-- package.json
|   |-- Dockerfile
|
|-- frontend/
|   |-- public/
|   |   |-- background.png
|   |   |-- index.html
|   |-- src/
|   |   |-- App.js
|   |   |-- index.jsx
|   |   |-- styles.css
|   |-- nginx.conf
|   |-- package.json
|   |-- vite.config.js
|   |-- Dockerfile
|
|-- .gitignore
|-- docker-compose.yml
|-- README.md
```
---
# Backend - `server.js`
## Caminho: /backend/server.js

```js
const express = require("express");
const cors = require("cors");
const ldapAuth = require("./auth");
const { getEmployees, addSkill } = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

// Rota para listar colaboradores
app.get("/employees", async (req, res) => {
  const employees = await getEmployees();
  res.json(employees);
});

// Rota para autenticação via LDAP
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await ldapAuth(username, password);
  if (user) {
    res.json({ authenticated: true, user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Rota para adicionar skills ao colaborador
app.post("/employees/skills", async (req, res) => {
  const { userId, skill } = req.body;
  await addSkill(userId, skill);
  res.json({ message: "Skill adicionada com sucesso!" });
});

app.listen(5000, () => console.log("Backend rodando na porta 5000"));
```
---
# Backend - `database.js`
## Caminho: /backend/database.js

```js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "database",
  user: "portal_user",
  password: "portal_password",
  database: "portal_ti"
});

async function getEmployees() {
  const [rows] = await pool.query("SELECT * FROM employees");
  return rows;
}

async function addSkill(userId, skill) {
  await pool.query("INSERT INTO skills (user_id, skill) VALUES (?, ?)", [userId, skill]);
}

module.exports = { getEmployees, addSkill };
```
---
# Backend - `auth.js`
## Caminho: /backend/auth.js

```js
const ldap = require("ldapjs");

async function ldapAuth(username, password) {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({ url: "ldap://ad-server" });
    const dn = `CN=${username},OU=Usuarios,DC=xpto,DC=corp`;
    client.bind(dn, password, (err) => {
      if (err) return resolve(null);
      resolve({ username });
    });
  });
}

module.exports = ldapAuth;
```
---
# Backend - `Dockerfile`
## Caminho: /backend/Dockerfile
```yml
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "server.js"]
```
---
# Frontend - `App.jsx`
## Caminho: /frontend/src/App.jsx

```jsx
import React, { useState, useEffect } from 'react';
import './styles.css';

// Dados simulados dos colaboradores
const colaboradores = [
  {
    nome: 'Ana Souza',
    email: 'ana.souza@empresa.com',
    area: 'Desenvolvimento',
    skills: 'React, Node.js, MongoDB',
  },
  {
    nome: 'Carlos Lima',
    email: 'carlos.lima@empresa.com',
    area: 'DevOps',
    skills: 'AWS, Terraform, Docker, Kubernetes',
  },
  {
    nome: 'Mariana Costa',
    email: 'mariana.costa@empresa.com',
    area: 'Banco de Dados',
    skills: 'PostgreSQL, MySQL, Redis',
  },
  {
    nome: 'Roberto Alves',
    email: 'roberto.alves@empresa.com',
    area: 'Segurança',
    skills: 'Pentest, Firewall, IAM',
  },
  {
    nome: 'Fernanda Rocha',
    email: 'fernanda.rocha@empresa.com',
    area: 'Gestão de Projetos',
    skills: 'Scrum, Kanban, OKRs',
  },
];

export default function App() {
  const [busca, setBusca] = useState('');
  const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Aplica a classe de tema ao <body>
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    document.body.style.backgroundImage = `url('/background.png')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
  }, [darkMode]);

  // Filtragem com base na busca
  const filtrados = colaboradores.filter((colab) =>
    `${colab.nome} ${colab.area} ${colab.skills} ${colab.email}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Portal de Competências</h1>
        <div>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '🌞 Tema Claro' : '🌙 Tema Escuro'}
          </button>
          <button className="login-btn">Fazer Login</button>
        </div>
      </div>

      <p className="description">
        O objetivo do Portal é encontrar profissionais qualificados para atuar em demandas e/ou projetos baseados em tecnologias específicas, dando mais visibilidade e oportunidades para os colaboradores internos.
      </p>

      <input
        type="text"
        placeholder="Buscar por nome, área, skill ou e-mail..."
        className="search-input"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="employee-list">
        {filtrados.length > 0 ? (
          filtrados.map((colab, index) => (
            <div key={index} className="employee-card">
              <strong>{colab.nome}</strong>
              <p><em>Área:</em> {colab.area}</p>
              <p><em>Skills:</em> {colab.skills}</p>
              <p><em>E-mail:</em> {colab.email}</p>
            </div>
          ))
        ) : (
          <p className="not-found">Nenhum colaborador encontrado.</p>
        )}
      </div>
    </div>
  );
}
```    
---
# Frontend - `styles.css`
## Caminho: /frontend/styles.css

```css
/* Reset básico */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

/* Container da aplicação */
.container {
  padding: 2rem;
  position: relative;
  z-index: 1;
}

/* Overlay escuro por cima da imagem de fundo */
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparente */
  z-index: -1;
}

/* Tema claro */
.light {
  color: #111;
}

/* Tema escuro */
.dark {
  color: #fff;
}

/* Cabeçalho com título e botões */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.header h1 {
  margin: 0;
}

/* Botão para alternar tema */
.theme-toggle {
  background-color: #444;
  color: #fff;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.light .theme-toggle {
  background-color: #ddd;
  color: #111;
}

/* Botão de login */
.login-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

/* Descrição da aplicação */
.description {
  margin: 1rem 0;
  font-size: 1.1rem;
}

/* Campo de busca mais estreito e centralizado */
.search-input {
  width: 60%;
  max-width: 600px;
  display: block;
  margin: 0 auto 2rem auto;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

/* Cards de colaboradores */
.employee-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  justify-content: center;
}

/* Estilização dos cards */
.employee-card {
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

/* Efeito hover: sombra + leve zoom */
.employee-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transform: scale(1.03);
}

/* Adaptação de cor dos cards ao tema */
.light .employee-card {
  background-color: white;
  color: #111;
}

.dark .employee-card {
  background-color: #fff;
  color: #111;
}

/* Nome em destaque */
.employee-card strong {
  display: block;
  font-size: 1.2rem;
  color: orange;
  margin-bottom: 0.5rem;
}

/* Parágrafos dentro dos cards */
.employee-card p {
  margin: 0.3rem 0;
  color: inherit;
}

/* Rótulos em negrito */
.employee-card p em {
  font-style: normal;
  font-weight: bold;
}

/* Estilo quando não encontra resultados */
.not-found {
  text-align: center;
  font-style: italic;
}
```

---
# Frontend - `Dockerfile`
## Caminho: /frontend/Dockerfile

```yml
# Etapa 1: Build do frontend
FROM node:18 AS builder
WORKDIR /app

# Instala dependências primeiro (melhora cache)
COPY package*.json ./
RUN npm install

# Copia o restante do código-fonte
COPY public ./public
COPY src ./src
# Opcional se os acima já cobrem tudo
# COPY . . 

# Gera build de produção
RUN npm run build

# Etapa 2: Servir via NGINX
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
---
# Docker Compose
## Caminho: ./`docker-compose.yml`

```yml
version: '3.8'
services:
  database:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: portal_ti
      MYSQL_USER: portal_user
      MYSQL_PASSWORD: portal_password
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - database
    environment:
      - NODE_ENV=production

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    restart: always

volumes:
  db_data:
```
---
