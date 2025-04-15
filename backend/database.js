const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "database",
  user: "portal_user",
  password: "portal_password",
  database: "portal_skills"
});

async function getEmployees() {
  const [rows] = await pool.query("SELECT * FROM employees");
  return rows;
}

async function addSkill(userId, skill) {
  await pool.query("INSERT INTO skills (user_id, skill) VALUES (?, ?)", [userId, skill]);
}

module.exports = { getEmployees, addSkill };