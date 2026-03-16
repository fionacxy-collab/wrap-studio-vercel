// API 路由：/api/generate
// 调用 Replicate 生成包装纸图案

const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// 风格配置
const STYLE_PROMPTS = {
  kawaii: 'cute kawaii cartoon seamless pattern, pastel pink and purple, soft lighting, adorable characters, heart decorations, fluffy texture, gift wrapping paper design, tileable',
  pastel: 'pastel macaron seamless pattern, soft dreamy watercolor, mint green, baby pink, lavender, gentle gradients, gift wrapping paper, tileable pattern',
  fresh: 'fresh nature botanical seamless pattern, green leaves and flowers, organic shapes, natural lighting, mint and sage colors, eco-friendly, gift wrap',
  ocean: 'ocean blue seamless pattern, underwater bubbles, wave patterns, refreshing summer, light blue tones, gift wrapping paper, tileable',
  retro: 'retro Showa Japanese vintage seamless pattern, soft faded colors, nostalgic, cherry blossoms, gentle sepia tones, gift wrapping paper',
  galaxy: 'galaxy cosmic purple blue seamless pattern, starry night, nebula clouds, deep space, sparkling stars, magical, gift wrapping paper'
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
  
  // 检查 Token
  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ 
      error: 'Server configuration error',
      message: 'REPLICATE_API_TOKEN not set'
    });
  }
  
  try {
    const { style } = req.body;
    
    if (!style) {
      return res.status(400).json({ error: 'Missing style' });
    }
    
    const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.kawaii;
    
    console.log('Generating with style:', style, 'Prompt:', prompt);
    
    // 使用 flux 模型（更稳定）
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          aspect_ratio: "1:1",
          output_format: "png",
          output_quality: 80
        }
      }
    );
    
    if (!output || !output[0]) {
      throw new Error('No output from model');
    }
    
    console.log('Generated:', output[0]);
    
    return res.status(200).json({
      success: true,
      imageUrl: output[0],
      style: style
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Generation failed',
      message: error.message,
      details: error.toString()
    });
  }
};