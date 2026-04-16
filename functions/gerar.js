export async function onRequestPost(context) {
  const { request } = context;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    const body = await request.json();
    // Sua Secret Key extraída do PHP funcional
    const SK = context.env.MEDUSAPAY_SK; // Pega a chave de forma segura das configurações

    const valor = parseFloat(body.valor || 0);
    const nome = body.nome || '';
    const email = body.email || '';
    const cpf = (body.cpf || '').replace(/\D/g, '');

    // Montando o payload exatamente como no seu PHP
    const payload = JSON.stringify({
      amount: Math.round(valor * 100),
      paymentMethod: 'pix',
      customer: {
        name: nome,
        email: email,
        document: {
          number: cpf,
          type: 'cpf',
        },
      },
      items: [
        {
          title: 'Reserva de Veiculo - Kovi',
          unitPrice: Math.round(valor * 100),
          quantity: 1,
          tangible: false,
        },
      ],
      pix: {
        expiresInDays: 1,
      },
    });

    // Autenticação Basic Auth (SK:x)
    const auth = btoa(`${SK}:x`);

    const response = await fetch('https://api.v2.medusapay.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: payload,
    } );

    const result = await response.json();

    if (response.ok) {
      const pixData = result.data?.pix || result.pix || {};
      return new Response(JSON.stringify({
        sucesso: true,
        qr_code: pixData.qrcode || pixData.qrCode || null,
        copia_cola: pixData.qrcode_base64 || pixData.qrCodeBase64 || pixData.payload || null,
        _debug_retorno: result
      }), { headers: { ...headers, "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({ 
        sucesso: false, 
        erro: result.message || result.error || 'Erro na MedusaPay' 
      }), { status: response.status, headers });
    }

  } catch (e) {
    return new Response(JSON.stringify({ sucesso: false, erro: e.message }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
