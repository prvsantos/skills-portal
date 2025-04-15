// backend/routes/authRoute.js
const express = require('express');
const jwt = require('jsonwebtoken');
const ldapAuth = require('../auth');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await ldapAuth(username, password);

  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
