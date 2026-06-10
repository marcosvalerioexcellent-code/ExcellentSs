// Arquivo: /api/meta.js

export default async function handler(req, res) {
  // CREDENCIAIS DA API
  const ACCESS_TOKEN = "EAAO1kaxzrSQBRsd535Xc0jFVSurw9c3vMGeY7lX4Ws6eI8MiZCorCn2TrDkVGxfEZBeaPO4WKeGP7Th32sFf8KwjFPpBh4x4nwIwFQmWohnHXfXMZAEbI1eNLmFXfEZBgXDh64ivx3uLSfp2onBvKgkyteZCHoe1iGG4mMPBI56CoL1xknNR20yiZA42JAvBEWPlPIZAXzaWxPp5feLZA5t71qkODrPlNjI30IZAYYQO2D2XZCXHwvTj9Vmk3R7NQalNid4kIGiyM6T5VE8yvWZBAqE";
  const APP_ID = "1044062198279460";
  const APP_SECRET = "33d10a23b4407496726bc8e0d0850403";
  
  // ATENÇÃO: Substitua o valor abaixo pelo ID da sua Conta de Anúncios!
  const AD_ACCOUNT_ID = "754104033807907"; 

  try {
    // Busca os dados de desempenho diário dos últimos 30 dias
    const url = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/insights?time_increment=1&date_preset=last_30d&fields=spend,clicks,impressions,cpc,ctr&access_token=${ACCESS_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Falha interna ao comunicar com o Meta Ads' });
  }
}
