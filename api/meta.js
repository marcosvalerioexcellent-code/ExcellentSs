// Arquivo: /api/meta.js

export default async function handler(req, res) {
  // SUAS CREDENCIAIS REAIS DA API AQUI
  const ACCESS_TOKEN = "EAALGlckDtlwBRhgHQpPaamesm3oTN06woGSI53Mv3bw6FFG8ZC9u7ZCy4jpHLEBUKO1qiqTCxmZB3xXgovMDMjbrWl81ZABZB2Nc6KyYZCQoo74JjE3YowWC9RujflISoZArENYabXV1wasHUZAg42LN9Et24Wcue8UJIVjzt4ZCs9sUNaFDo6gEeArGEmztiEQZDZD";
  const AD_ACCOUNT_ID = "781296578311772"; 

  // --- SE FOR UM COMANDO PARA LIGAR/DESLIGAR CAMPANHA (POST) ---
  if (req.method === 'POST') {
    try {
      const { campaign_id, status } = req.body;
      
      // Envia a ordem de mudança de status para o Facebook
      const updateUrl = `https://graph.facebook.com/v19.0/${campaign_id}?status=${status}&access_token=${ACCESS_TOKEN}`;
      const updateRes = await fetch(updateUrl, { method: 'POST' });
      const updateData = await updateRes.json();

      if (updateData.error) {
        return res.status(400).json({ success: false, error: updateData.error.message });
      }

      return res.status(200).json({ success: true, data: updateData });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Falha ao alterar campanha.' });
    }
  }

  // --- SE FOR PARA PUXAR OS DADOS DO DASHBOARD (GET) ---
  const preset = req.query.preset || 'last_30d';

  try {
    const urlDaily = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/insights?time_increment=1&date_preset=${preset}&fields=spend,clicks,impressions,cpc,ctr&access_token=${ACCESS_TOKEN}`;
    const resDaily = await fetch(urlDaily);
    const dataDaily = await resDaily.json();

    const urlCampaigns = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,daily_budget,lifetime_budget&limit=50&access_token=${ACCESS_TOKEN}`;
    const resCampaigns = await fetch(urlCampaigns);
    const dataCampaigns = await resCampaigns.json();

    const urlCampInsights = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/insights?level=campaign&date_preset=${preset}&fields=campaign_id,reach,frequency,spend,impressions,cpm,inline_link_clicks,cpc,ctr,clicks&limit=50&access_token=${ACCESS_TOKEN}`;
    const resCampInsights = await fetch(urlCampInsights);
    const dataCampInsights = await resCampInsights.json();

    res.status(200).json({
      daily: dataDaily.data || [],
      campaigns: dataCampaigns.data || [],
      campaign_insights: dataCampInsights.data || []
    });

  } catch (error) {
    res.status(500).json({ error: 'Falha interna na API.' });
  }
}
