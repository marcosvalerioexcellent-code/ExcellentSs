// Arquivo: /api/meta.js

export default async function handler(req, res) {
  // SUAS CREDENCIAIS REAIS DA API AQUI
  const ACCESS_TOKEN = "EAAO1kaxzrSQBRsd535Xc0jFVSurw9c3vMGeY7lX4Ws6eI8MiZCorCn2TrDkVGxfEZBeaPO4WKeGP7Th32sFf8KwjFPpBh4x4nwIwFQmWohnHXfXMZAEbI1eNLmFXfEZBgXDh64ivx3uLSfp2onBvKgkyteZCHoe1iGG4mMPBI56CoL1xknNR20yiZA42JAvBEWPlPIZAXzaWxPp5feLZA5t71qkODrPlNjI30IZAYYQO2D2XZCXHwvTj9Vmk3R7NQalNid4kIGiyM6T5VE8yvWZBAqE";
  const APP_ID = "1044062198279460";
  const APP_SECRET = "33d10a23b4407496726bc8e0d0850403";
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
