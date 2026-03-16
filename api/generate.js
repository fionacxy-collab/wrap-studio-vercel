// API 路由：/api/generate
// 生成包装纸图案 - 简化版

// 风格配置对应不同颜色的占位图
const STYLE_IMAGES = {
  kawaii: 'https://placehold.co/1024x1024/ffdbec/ff69b4/png?text=🐰+Kawaii+Wrapping+Paper',
  pastel: 'https://placehold.co/1024x1024/e6e6fa/da70d6/png?text=🧁+Pastel+Wrapping+Paper', 
  fresh: 'https://placehold.co/1024x1024/90EE90/228B22/png?text=🌿+Fresh+Wrapping+Paper',
  ocean: 'https://placehold.co/1024x1024/87CEEB/4682B4/png?text=🐳+Ocean+Wrapping+Paper',
  retro: 'https://placehold.co/1024x1024/FFE4E1/DB7093/png?text=🌸+Retro+Wrapping+Paper',
  galaxy: 'https://placehold.co/1024x1024/9370DB/4B0082/png?text=✨+Galaxy+Wrapping+Paper'
};

module.exports = async (req, res) => {
  // 允许 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { style } = req.body;
    
    if (!style) {
      return res.status(400).json({ error: 'Missing style' });
    }
    
    // 返回对应的占位图
    const imageUrl = STYLE_IMAGES[style] || STYLE_IMAGES.kawaii;
    
    // 添加随机参数避免缓存
    const urlWithCache = `${imageUrl}&t=${Date.now()}`;
    
    return res.status(200).json({
      success: true,
      imageUrl: urlWithCache,
      style: style,
      note: '演示版：使用占位图。真实 AI 生成需要接入 Replicate/Stable Diffusion API'
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Generation failed',
      message: error.message
    });
  }
};