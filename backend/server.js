require('dotenv').config();
const express = require("express");
const cors = require("cors");
const ldapAuth = require("./auth");
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

// Rota para adicionar skills
app.post("/employees/skills", async (req, res) => {
  const { userId, skill } = req.body;
  await addSkill(userId, skill);
  res.json({ message: "Skill adicionada com sucesso!" });
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

app.listen(5000, () => console.log("Backend rodando na porta 5000"));
