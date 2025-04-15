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
  const [modalAberto, setModalAberto] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [modalLdap, setModalLdap] = useState(false);
  const [usuarioLdap, setUsuarioLdap] = useState('');
  const [senhaLdap, setSenhaLdap] = useState('');


  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    document.body.style.backgroundImage = `url('/background.png')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
  }, [darkMode]);

  const filtrados = colaboradores.filter((colab) =>
    `${colab.nome} ${colab.area} ${colab.skills} ${colab.email}`.toLowerCase().includes(busca.toLowerCase())
  );

  const autenticar = async () => {
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password: senha })
      });

      if (res.ok) {
        const data = await res.json();
        setAutenticado(true);
        setModalAberto(false);
      } else {
        alert('Usuário ou senha inválidos.');
      }
    } catch (err) {
      alert('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div className="container">
      {/* Cabeçalho com botões */}
      <div className="header">
        <h1 className="titulo-centralizado">Portal de Competências</h1>

        {/* Botões fixos e alinhados */}
        <div className="header-buttons">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '🌞 Tema Claro' : '🌙 Tema Escuro'}
          </button>

          {!autenticado && (
            <button className="login-btn" onClick={() => setModalAberto(true)}>
              Fazer Login
            </button>
          )}

          {/* 🔧 LDAP TEST - Botão de teste da conexão LDAP */}
          <button className="login-btn" onClick={() => setModalLdap(true)}>
            🔧 Testar LDAP
          </button>
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

      {/* Renderiza os cards apenas se houver busca */}
      {busca && (
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
      )}

      {/* Modal de Login */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Login</h2>
            <input type="text" placeholder="Usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <button onClick={autenticar}>Entrar</button>
            <button className="close-btn" onClick={() => setModalAberto(false)}>Fechar</button>
          </div>
        </div>
      )}

      {modalLdap && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Teste de Conexão LDAP</h2>
            <input
              type="text"
              placeholder="Usuário"
              value={usuarioLdap}
              onChange={(e) => setUsuarioLdap(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senhaLdap}
              onChange={(e) => setSenhaLdap(e.target.value)}
            />
            <button
              onClick={() => {
                fetch('http://localhost:5000/ldap-test', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: usuarioLdap, password: senhaLdap })
                })
                  .then(res => res.json())
                  .then(data => {
                    alert(data.success
                      ? `✅ Conectado! Usuário encontrado: ${data.entries[0]?.cn || 'N/A'}`
                      : `❌ Falha: ${data.message || 'Erro desconhecido'}`);
                    setModalLdap(false);
                    setUsuarioLdap('');
                    setSenhaLdap('');
                  })
                  .catch(err => {
                    console.error('Erro LDAP:', err);
                    alert('Erro na requisição LDAP.');
                    setModalLdap(false);
                  });
              }}
            >
              🔧 Testar Conexão
            </button>
            <button className="close-btn" onClick={() => setModalLdap(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
