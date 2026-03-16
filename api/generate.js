// API 路由：/api/generate
// 调用 Replicate 生成包装纸图案

const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// 风格配置
const STYLE_PROMPTS = {
  kawaii: 'cute kawaii cartoon style, pastel pink and purple, soft lighting, adorable characters, heart decorations, fluffy texture, seamless pattern, gift wrapping paper design',
  pastel: 'pastel macaron colors, soft dreamy watercolor, mint green, baby pink, lavender, gentle gradients, seamless pattern, gift wrapping paper',
  fresh: 'fresh nature botanical, green leaves and flowers, organic shapes, natural lighting, mint and sage colors, eco-friendly, seamless pattern',
  ocean: 'ocean blue and cyan, underwater bubbles, wave patterns, refreshing summer, light blue tones, seamless pattern, gift wrapping paper',
  retro: 'retro Showa Japanese vintage, soft faded colors, nostalgic, cherry blossoms, gentle sepia tones, film grain texture, seamless pattern',
  galaxy: 'galaxy cosmic purple and blue, starry night, nebula clouds, deep space, sparkling stars, magical atmosphere, seamless pattern'
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
    const { imageBase64, style } = req.body;
    
    if (!imageBase64 || !style) {
      return res.status(400).json({ error: 'Missing image or style' });
    }
    
    const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.kawaii;
    
    console.log('Generating with style:', style);
    
    // 使用 stability-ai/stable-diffusion 模型
    // 这个模型支持 image-to-image
    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt: prompt,
          image: imageBase64,
          strength: 0.7,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50
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
      message: error.message
    });
  }
};