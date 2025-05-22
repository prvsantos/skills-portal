const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 🔐 Nova rota de autenticação usando API externa
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

// ✅ Importa fetch dinamicamente como ESM
  const fetch = (await import('node-fetch')).default;

  try {
    // Chamada para API externa da empresa
    const response = await fetch('https://api.cencosud.cl/si/cl/v0/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.EXTERNAL_API_KEY  // Variável de ambiente com a chave da API
      },
      body: JSON.stringify({
        user: usuario-de-rede,
        pass: 'sua-senha'
      })
    });

    const data = await response.json();

    // Caso a autenticação falhe
    if (!response.ok || !data || data.success === false) {
      return res.status(401).json({ error: 'Falha na autenticação externa' });
    }

    // Autenticação bem-sucedida
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

  } catch (error) {
    console.error("Erro ao autenticar na API externa:", error);
    res.status(500).json({ error: 'Erro interno na autenticação' });
  }
});

module.exports = router;
