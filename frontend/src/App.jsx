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
    skills: 'AWS, Azure, GCP, OCI, Terraform, Docker, Kubernetes, CI/CD, GitHub, GitLab',
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

  // Aplica o tema claro/escuro e configura a imagem de fundo de forma responsiva
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    document.body.style.backgroundImage = `url('/background.png')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
  }, [darkMode]);

  // Aplica o filtro de busca (case insensitive)
  const filtrados = colaboradores.filter((colab) =>
    `${colab.nome} ${colab.area} ${colab.skills} ${colab.email}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container">
      {/* Cabeçalho com título e botões */}
      <div className="header">
        <h1>Portal de Competências</h1>
        <div>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '🌞 Tema Claro' : '🌙 Tema Escuro'}
          </button>
          <button className="login-btn">Fazer Login</button>
        </div>
      </div>

      {/* Descrição do objetivo do portal */}
      <p className="description">
        O objetivo do Portal é encontrar profissionais qualificados para atuar em demandas e/ou projetos baseados em tecnologias específicas, dando mais visibilidade e oportunidades para os colaboradores internos.
      </p>

      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Buscar por nome, área, skill ou e-mail..."
        className="search-input"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* Lista de colaboradores filtrados (só aparece se algo for digitado) */}
      <div className="employee-list">
        {busca.length > 0 && (
          filtrados.length > 0 ? (
            filtrados.map((colab, index) => (
              <div key={index} className="employee-card">
                <strong>{colab.nome}</strong>
                <p><em>Área:</em> {colab.area}</p>
                <p><em>Skills:</em> {colab.skills}</p>
                <p><em>E-mail:</em> {colab.email}</p>
              </div>
            ))
          ) : (
            // Exibe mensagem caso não encontre ninguém na busca
            <p className="not-found">Nenhum colaborador encontrado.</p>
          )
        )}
      </div>
    </div>
  );
}
