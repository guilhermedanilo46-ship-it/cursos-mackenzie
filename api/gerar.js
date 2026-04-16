const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { valor, nome, email, cpf, produto } = req.body;
  const api_key = 'sk_live_66157972074358826626';

  try {
    const response = await axios.post('https://api.medusapay.com/v1/pix/gerar', {
      api_key: api_key,
      valor: valor,
      nome: nome,
      email: email,
      cpf: cpf,
      descricao: produto
    }, {
      headers: { 'Content-Type': 'application/json' }
    } );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ status: 'erro', msg: 'Erro ao conectar com MedusaPay' });
  }
};
