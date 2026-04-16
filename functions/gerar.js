export async function onRequestPost(context) {
  const { request } = context;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const body = await request.json();
    const api_key = "sk_live_66157972074358826626";

    // Montando os dados exatamente como no seu PHP funcional
    const formData = new URLSearchParams();
    formData.append("api_key", api_key);
    formData.append("valor", body.valor);
    formData.append("nome", body.nome);
    formData.append("email", body.email);
    formData.append("cpf", body.cpf);
    formData.append("descricao", body.produto);

    const response = await fetch("https://api.medusapay.com/v1/pix/gerar", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString( ),
    });

    const result = await response.text();
    return new Response(result, { headers: { ...headers, "Content-Type": "application/json" } });

  } catch (e) {
    return new Response(JSON.stringify({ status: "erro", msg: e.message }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
