const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "database",
  user: "portal_user",
  password: "portal_password",
  database: "portal_skills"
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      skill VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Retorna lista de colaboradores (mock ou real)
async function getEmployees() {
  const [rows] = await pool.query("SELECT DISTINCT username FROM user_skills");
  return rows;
}

// Adiciona nova skill por colaborador
async function addSkill(username, skill) {
  await pool.query("INSERT INTO user_skills (username, skill) VALUES (?, ?)", [username, skill]);
}

// Retorna todas as skills cadastradas de um colaborador
async function getSkillsByUser(username) {
  const [rows] = await pool.query("SELECT skill FROM user_skills WHERE username = ?", [username]);
  return rows.map(row => row.skill);
}

// Recupera todas as skills de um usuário
async function getSkillsByUsername(username) {
  const conn = await pool.getConnection();
  const [rows] = await conn.query(
    "SELECT skill FROM skills WHERE username = ?", [username]
  );
  conn.release();
  return rows;
}

module.exports = {
  getEmployees,
  addSkill,
  getSkillsByUser,
  getSkillsByUsername
};
