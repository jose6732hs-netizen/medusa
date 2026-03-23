export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse dynamic route: /api/tenant/[tenantId]/chat
  const pathParts = req.url.split('/').filter(Boolean);
  
  if (pathParts.length < 4 || pathParts[1] !== 'tenant' || pathParts[3] !== 'chat') {
    return res.status(404).json({ error: 'Not found' });
  }

  const tenantId = pathParts[2];

  if (req.method === 'POST') {
    try {
      const { message, userId = 'anonymous' } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Simular resposta da OpenAI (dummy)
      const aiResponse = {
        id: `chat_${Date.now()}`,
        tenantId,
        userId,
        userMessage: message,
        aiMessage: `[Chat IA] Dummy response for tenant ${tenantId}: "${message}" - Esta é uma resposta simulada. Integração real com OpenAI em breve.`,
        timestamp: new Date().toISOString(),
        model: process.env.AI_MODEL || 'gpt-4-turbo',
      };

      // Simular salvamento em banco de dados
      console.log('[AI Chat] New message saved:', {
        tenant_id: tenantId,
        user_id: userId,
        message: message,
        response: aiResponse.aiMessage,
      });

      return res.status(200).json({
        success: true,
        data: aiResponse,
      });
    } catch (error) {
      console.error('[AI Chat] Error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  }

  // GET /api/tenant/[tenantId]/chat - Listar histórico de chat
  if (req.method === 'GET') {
    try {
      const userId = req.query.userId || 'anonymous';
      
      // Simular dados do banco de dados
      const chatHistory = [
        {
          id: 'chat_1',
          tenantId,
          userId,
          userMessage: 'Olá!',
          aiMessage: '[Chat IA] Olá! Como posso ajudar?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'chat_2',
          tenantId,
          userId,
          userMessage: 'Qual é o meu saldo?',
          aiMessage: '[Chat IA] Seu saldo atual é R$ 1.234,56',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
      ];

      return res.status(200).json({
        success: true,
        data: {
          tenantId,
          userId,
          messages: chatHistory,
        },
      });
    } catch (error) {
      console.error('[AI Chat] Error fetching history:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
