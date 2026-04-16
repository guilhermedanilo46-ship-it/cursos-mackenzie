const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { valor, nome, email, cpf, produto } = req.body;
  const api_key = 'sk_live_66157972074358826626';

  try {
    // FORMATO EXATO QUE O MEDUSAPAY EXIGE
    const params = new URLSearchParams();
    params.append('api_key', api_key);
    params.append('valor', valor);
    params.append('nome', nome);
    params.append('email', email);
    params.append('cpf', cpf);
    params.append('descricao', produto);

    const response = await axios.post('https://api.medusapay.com/v1/pix/gerar', params.toString( ), {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Erro Medusa:', error.response ? error.response.data : error.message);
    return res.status(500).json({ status: 'erro', msg: 'Erro ao conectar com MedusaPay' });
  }
};
