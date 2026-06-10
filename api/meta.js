// Arquivo: /api/meta.js

export default async function handler(req, res) {
  // SUAS CREDENCIAIS REAIS DA API AQUI
  const ACCESS_TOKEN = "EAALGlckDtlwBRjvvnfBgWN5YYisq7c6GZBfZArpqGqStWZBemt1uDwnvNJSELdSU7jnrjDJyDehz4ffkjthZBkW4cot5UrWGaQ3reN1l1gZBlBiHFHrOap4WqmU9jqnuxenEPyZABV6GJMQg6WJvZBqZB2qHsrQIyuXQu7WVcCNwCFPRTFzxyZCcP1uJpVvqNbgZDZD";
  const APP_ID = "781296578311772";
  const APP_SECRET = "d18290041b036fafb40aeb73ccb83d05";
  const AD_ACCOUNT_ID = "754104033807907"; 

  // Pega o filtro selecionado no painel (se não tiver, usa 30 dias)
  const preset = req.query.preset || 'last_30d';

  try {
    // 1. Puxa os Totais Diários (Para os Gráficos de Linha)
    const urlDaily = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/insights?time_increment=1&date_preset=${preset}&fields=spend,clicks,impressions,cpc,ctr&access_token=${ACCESS_TOKEN}`;
    const resDaily = await fetch(urlDaily);
    const dataDaily = await resDaily.json();

    if (dataDaily.error) {
      return res.status(400).json({ error: dataDaily.error.message });
    }

    // 2. Puxa a Lista de Campanhas (Para saber Nome, Status e Orçamento)
    const urlCampaigns = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,daily_budget,lifetime_budget&limit=50&access_token=${ACCESS_TOKEN}`;
    const resCampaigns = await fetch(urlCampaigns);
    const dataCampaigns = await resCampaigns.json();

    // 3. Puxa os Insights Individuais de cada Campanha no Período Selecionado
    const urlCampInsights = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/insights?level=campaign&date_preset=${preset}&fields=campaign_id,reach,frequency,spend,impressions,cpm,inline_link_clicks,cpc,ctr,clicks&limit=50&access_token=${ACCESS_TOKEN}`;
    const resCampInsights = await fetch(urlCampInsights);
    const dataCampInsights = await resCampInsights.json();

    // Retorna tudo de forma organizada para o seu painel
    res.status(200).json({
      daily: dataDaily.data || [],
      campaigns: dataCampaigns.data || [],
      campaign_insights: dataCampInsights.data || []
    });

  } catch (error) {
    res.status(500).json({ error: 'Falha interna na API.' });
  }
}
