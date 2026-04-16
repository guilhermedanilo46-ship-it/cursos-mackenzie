export async function onRequestPost(context) {
  const { request } = context;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    const body = await request.json();
    const SK = context.env.MEDUSAPAY_SK; // Verifique se está preenchido no painel da Cloudflare

    const valor = parseFloat(body.valor || 0);
    const nome = body.nome || '';
    const email = body.email || '';
    const cpf = (body.cpf || '').replace(/\D/g, '');

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
    });

    // Captura o texto puro primeiro para evitar quebra no JSON
    const responseText = await response.text();
    let result;
    
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      return new Response(JSON.stringify({ 
        sucesso: false, 
        erro: 'Retorno inválido da gateway',
        _raw: responseText 
      }), { status: response.status, headers: { ...headers, "Content-Type": "application/json" } });
    }

    if (response.ok) {
      // Mapeamento exato baseado no padrão MedusaPay
      const pixData = result.pix || result.data?.pix || {};
      
      return new Response(JSON.stringify({
        sucesso: true,
        // O Pix Copia e Cola costuma vir no campo 'emv' ou 'payload'
        copia_cola: pixData.emv || pixData.payload || pixData.qrcode || null,
        // O QR Code em imagem costuma vir no campo 'qrcode_url' ou 'base64'
        qr_code: pixData.qrcode_url || pixData.qrcode_base64 || pixData.image || null,
        _debug_retorno: result
      }), { headers: { ...headers, "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({ 
        sucesso: false, 
        erro: result.message || result.error || 'Erro na MedusaPay',
        _debug_retorno: result
      }), { status: response.status, headers: { ...headers, "Content-Type": "application/json" } });
    }

  } catch (e) {
    return new Response(JSON.stringify({ sucesso: false, erro: e.message }), { status: 500, headers: { ...headers, "Content-Type": "application/json" } });
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
