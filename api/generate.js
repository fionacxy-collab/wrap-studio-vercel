// API 路由：/api/generate
// 使用 Pollinations.ai 生成图片

const STYLE_PROMPTS = {
  kawaii: 'cute kawaii cartoon seamless pattern, pastel pink purple, adorable characters, hearts, fluffy texture, gift wrapping paper design, tileable, high quality, 2d flat design',
  pastel: 'pastel macaron seamless pattern, soft dreamy watercolor, mint green baby pink lavender, gentle gradients, gift wrapping paper, tileable, cute aesthetic',
  fresh: 'fresh nature botanical seamless pattern, green leaves flowers, organic shapes, mint sage colors, eco friendly gift wrap, tileable, watercolor style',
  ocean: 'ocean blue cyan seamless pattern, underwater bubbles waves, refreshing summer, light blue tones, gift wrapping paper, tileable, dreamy aquatic',
  retro: 'retro Showa Japanese vintage seamless pattern, soft faded colors, nostalgic cherry blossoms, sepia tones, gift wrapping paper, 1980s aesthetic',
  galaxy: 'galaxy cosmic purple blue seamless pattern, starry night nebula, deep space sparkling stars, magical gift wrapping paper, cosmic theme'
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
    
    if (!style || !STYLE_PROMPTS[style]) {
      return res.status(400).json({ error: 'Invalid style' });
    }
    
    const prompt = STYLE_PROMPTS[style];
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 100000);
    
    // Pollinations.ai URL
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`;
    
    // 返回 URL，让前端加载
    return res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      style: style,
      note: '使用 Pollinations.ai 免费生成'
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Generation failed',
      message: error.message
    });
  }
};