const https = require('https' );

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { valor, nome, email, cpf, produto } = req.body;
  const api_key = 'sk_live_66157972074358826626';

  // Montando os dados exatamente como no seu PHP funcional
  const postData = new URLSearchParams({
    'api_key': api_key,
    'valor': valor,
    'nome': nome,
    'email': email,
    'cpf': cpf,
    'descricao': produto
  }).toString();

  const options = {
    hostname: 'api.medusapay.com',
    port: 443,
    path: '/v1/pix/gerar',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  const request = https.request(options, (response ) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        res.status(200).json(JSON.parse(data));
      } catch (e) {
        res.status(500).json({ status: 'erro', msg: 'Resposta invalida da Medusa' });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ status: 'erro', msg: error.message });
  });

  request.write(postData);
  request.end();
};
