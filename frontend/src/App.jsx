import React, { useState, useEffect } from 'react';
import './styles.css';

// Simulação de dados estáticos para a busca
const colaboradores = [
  {
    nome: 'Ana Souza',
    email: 'ana.souza@empresa.com',
    setor: 'Finanças',
    cargo: 'Engenheira Frontend',
    lider: 'Marcos Silva',
    certificacoes: 'React, MongoDB',
    linkedin: 'https://www.linkedin.com/in/ana-souza',
    skills: 'React, Node.js, MongoDB',
  },
  {
    nome: 'Carlos Lima',
    email: 'carlos.lima@empresa.com',
    setor: 'DevOps',
    cargo: 'Especialista DevOps',
    lider: 'João Mendes',
    certificacoes: 'AWS, Terraform, CKE',
    linkedin: 'https://www.linkedin.com/in/carlos-lima',
    skills: 'AWS, Azure, GCP, OCI, Terraform, Docker, Kubernetes, CI/CD, GitHub, GitLab',
  },
  {
    nome: 'Mariana Costa',
    email: 'mariana.costa@empresa.com',
    setor: 'Dados',
    cargo: 'DBA',
    lider: 'Carlos Mendonça',
    certificacoes: '',
    linkedin: '',
    skills: 'PostgreSQL, MySQL, Redis',
  },
  {
    nome: 'Roberto Alves',
    email: 'roberto.alves@empresa.com',
    setor: 'Segurança da Informação',
    cargo: 'Engenheiro',
    lider: 'Fernanda Sousa',
    certificacoes: '',
    linkedin: '',
    skills: 'Pentest, Firewall, IAM',
  },
  {
    nome: 'Fernanda Rocha',
    email: 'fernanda.rocha@empresa.com',
    setor: 'Projetos',
    cargo: 'Gestor de Projetos',
    lider: 'Ana Carla',
    certificacoes: '',
    linkedin: '',
    skills: 'Scrum, Kanban, OKRs',
  },
];

export default function App() {
  const [busca, setBusca] = useState('');
  const [novaSkill, setNovaSkill] = useState('');
  const [minhasSkills, setMinhasSkills] = useState([]);
  const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [modalLdap, setModalLdap] = useState(false);
  const [usuarioLdap, setUsuarioLdap] = useState('');
  const [senhaLdap, setSenhaLdap] = useState('');

  // Aplica tema e imagem de fundo
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    document.body.style.backgroundImage = `url('/background.png')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
  }, [darkMode]);

  const filtrados = colaboradores.filter((colab) =>
    `${colab.nome} ${colab.setor} ${colab.skills} ${colab.email}`.toLowerCase().includes(busca.toLowerCase())
  );

  // ✅ Função de autenticação usando API externa
  const autenticar = async () => {
    try {
      const res = await fetch('https://api.cencosud.cl/si/cl/v0/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'TGF5LLPut5MzFujVa0LF58iyfPSEpNmf'
        },
        body: JSON.stringify({ user: usuario, pass: senha })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.auth === true || data.token || data.message?.toLowerCase().includes('sucesso')) {
          setAutenticado(true);
          setModalAberto(false);
          carregarSkillsUsuario(); // Carrega as skills após login
        } else {
          alert('❌ Falha na autenticação.');
        }
      } else {
        alert('❌ Erro: Credenciais inválidas ou falha na API.');
      }
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      alert("Erro de rede ou servidor fora do ar.");
    }
  };

  // Busca skills do usuário autenticado
  const carregarSkillsUsuario = async () => {
    try {
      const res = await fetch(`http://localhost:5000/employees/skills?username=${usuario}`);
      const data = await res.json();
      setMinhasSkills(data.map(item => item.skill));
    } catch (error) {
      console.error("Erro ao carregar skills:", error);
    }
  };

  // Envia nova skill para o backend
  const salvarNovaSkill = async () => {
    if (!novaSkill.trim()) return alert("Digite uma skill válida!");

    try {
      const res = await fetch('http://localhost:5000/employees/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, skill: novaSkill.trim() })
      });

      if (res.ok) {
        alert("Skill cadastrada com sucesso!");
        setNovaSkill('');
        carregarSkillsUsuario(); // Atualiza lista após salvar
      } else {
        alert("Erro ao salvar a skill.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar skill:", error);
      alert("Falha ao conectar com o servidor.");
    }
  };

  return (
    <div className="container">
      {/* Cabeçalho fixo */}
      <div className="header">
        <h1 className="titulo-centralizado">Portal de Competências</h1>

        <div className="header-buttons">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '🌞 Tema Claro' : '🌙 Tema Escuro'}
          </button>

          {!autenticado && (
            <button className="login-btn" onClick={() => setModalAberto(true)}>
              Fazer Login
            </button>
          )}

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

      {/* Cadastro de skills visível apenas para autenticado */}
      {autenticado && (
        <div className="add-skill-container">
          <h3>Minhas Skills</h3>
          <ul>
            {minhasSkills.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
          <input
            type="text"
            placeholder="Nova skill"
            value={novaSkill}
            onChange={(e) => setNovaSkill(e.target.value)}
            className="input-skill"
          />
          <button onClick={salvarNovaSkill} className="btn-salvar-skill">Salvar Skill</button>
        </div>
      )}

      {/* Lista de colaboradores apenas quando há busca */}
      {busca && (
        <div className="employee-list">
          {filtrados.length > 0 ? (
            filtrados.map((colab, index) => (
              <div key={index} className="employee-card">
                <strong>{colab.nome}</strong>
                <p><em>Cargo:</em> {colab.cargo}</p>
                <p><em>Líder:</em> {colab.lider}</p>
                <p><em>Setor:</em> {colab.setor}</p>
                <p><em>Skills:</em> <div className="badges inline-badges">
                  {colab.skills.split(',').map((skill, i) => (
                    <span key={i} className="badge">{skill.trim()}</span>
                  ))}
                </div></p>
                <p><em>Certificações:</em> {colab.certificacoes}</p>
                <p><em>E-mail:</em> {colab.email}</p>
                {colab.linkedin && (
                  <p>
                    <em>LinkedIn:</em>{' '}
                    <a href={colab.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                      <svg className="linkedin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                      </svg>
                    </a>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="not-found">Nenhum colaborador encontrado.</p>
          )}
        </div>
      )}

      {/* Modal de login com inputs seguros */}
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

      {/* Modal de teste de LDAP com segurança */}
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
