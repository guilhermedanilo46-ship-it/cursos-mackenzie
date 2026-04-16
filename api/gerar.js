const axios = require('axios');

module.exports = async (req, res) => {
  // Habilitar CORS para que o site na InfinityFree possa chamar esta API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'erro', msg: 'Metodo nao permitido' });
  }

  const { valor, nome, email, cpf, produto } = req.body;
  const api_key = 'sk_live_66157972074358826626';

  try {
    const response = await axios.post('https://api.medusapay.com/v1/pix/gerar', new URLSearchParams({
      api_key: api_key,
      valor: valor,
      nome: nome,
      email: email,
      cpf: cpf,
      descricao: produto
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'erro', msg: 'Erro ao conectar com MedusaPay' });
  }
};
