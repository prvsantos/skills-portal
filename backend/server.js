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