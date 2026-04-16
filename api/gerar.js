const https = require('https' );

module.exports = async (req, res) => {
  // Configuração de cabeçalhos para o navegador aceitar a resposta
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { valor, nome, email, cpf, produto } = req.body;
  const api_key = 'sk_live_66157972074358826626';

  // Montando os dados exatamente como no seu PHP funcional (CURLOPT_POSTFIELDS)
  const postData = `api_key=${api_key}&valor=${valor}&nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}&cpf=${cpf}&descricao=${encodeURIComponent(produto)}`;

  const options = {
    hostname: 'api.medusapay.com',
    port: 443,
    path: '/v1/pix/gerar',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = https.request(options, (response ) => {
    let body = '';
    response.on('data', (chunk) => body += chunk);
    response.on('end', () => {
      try {
        // Devolvemos exatamente o que a Medusa responder
        res.status(200).send(body);
      } catch (e) {
        res.status(500).json({ status: 'erro', msg: 'Erro ao processar resposta' });
      }
    });
  });

  request.on('error', (e) => {
    res.status(500).json({ status: 'erro', msg: e.message });
  });

  request.write(postData);
  request.end();
};
