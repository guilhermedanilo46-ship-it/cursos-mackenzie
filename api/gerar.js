const axios = require('axios');
const qs = require('qs');

module.exports = async (req, res) => {
  // Habilitar CORS para o site falar com a API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { valor, nome, email, cpf, produto } = req.body;
  const api_key = 'sk_live_66157972074358826626';

  // Montando os dados exatamente como no seu PHP (CURLOPT_POSTFIELDS)
  const data = qs.stringify({
    'api_key': api_key,
    'valor': valor,
    'nome': nome,
    'email': email,
    'cpf': cpf,
    'descricao': produto
  });

  try {
    const response = await axios.post('https://api.medusapay.com/v1/pix/gerar', data, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    } );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ status: 'erro', msg: 'Erro ao conectar com MedusaPay' });
  }
};
