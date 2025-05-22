require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { getEmployees, addSkill } = require("./database");
const authRoute = require('./routes/authRoute');

const app = express();

app.use(cors());
app.use(express.json());

// Rota de autenticação protegida via middleware separado
app.use('/api', authRoute);

// Rota para listar colaboradores
app.get("/employees", async (req, res) => {
  const employees = await getEmployees();
  res.json(employees);
});

// Rota para autenticação via LDAP (legado, pode remover se usar apenas /api/login)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await ldapAuth(username, password);
  if (user) {
    res.json({ authenticated: true, user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Rota de saúde
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Rota para adicionar skills ao colaborador
app.post("/employees/skills", async (req, res) => {
  const { username, skill } = req.body;
  if (!username || !skill) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  try {
    await addSkill(username, skill);
    res.json({ message: "Skill adicionada com sucesso!" });
  } catch (err) {
    console.error("Erro ao adicionar skill:", err);
    res.status(500).json({ message: "Erro ao adicionar skill" });
  }
});

// 🔧 LDAP TEST - Rota temporária para testar a conexão LDAP
app.post('/ldap-test', (req, res) => {
  const ldap = require('ldapjs');
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Informe 'username' e 'password'" });
  }

  const client = ldap.createClient({ url: process.env.LDAP_URL });

  const dn = `CN=${username},OU=Usuarios,${process.env.LDAP_BASE_DN}`;

  client.bind(dn, password, (err) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Falha na autenticação", error: err.message });
    }

    const base = process.env.LDAP_BASE_DN;
    const options = {
      scope: "sub",
      filter: `(sAMAccountName=${username})`
    };

    client.search(base, options, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Erro na busca LDAP" });

      const entries = [];
      result.on("searchEntry", entry => entries.push(entry.object));
      result.on("end", () => {
        client.unbind();
        res.json({ success: true, entries });
      });
    });
  });
});

// Rota para buscar skills de um colaborador específico
app.get("/employees/skills", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Usuário não informado" });

  try {
    const skills = await getSkillsByUsername(username);
    res.json(skills);
  } catch (error) {
    console.error("Erro ao buscar skills:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.listen(5000, () => console.log("Backend rodando na porta 5000"));
