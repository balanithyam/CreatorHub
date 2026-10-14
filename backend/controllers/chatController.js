export const handleChatQuery = async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const msg = message.toLowerCase();
    let reply = '';
    let suggestions = [];

    if (msg.includes('hook') || msg.includes('intro')) {
      reply = `Here is a high-retention hook framework for you:

🔥 **Curiosity Hook:** "Most people think ${context.title || 'this'} requires thousands of dollars, but this $10 secret changes everything."

💡 **Retention Tip:** Keep your on-screen cut within the first 3.5 seconds to hook 70%+ of viewers past the drop-off cliff.`;
      suggestions = ['How to improve video pacing?', 'Generate 5 video titles', 'Write a 60s Short script'];
    } else if (msg.includes('title') || msg.includes('thumbnail')) {
      reply = `Here are 3 high-CTR title options tailored for your audience:

1. ⚡ **I Tested ${context.title || 'This'} for 30 Days (SHOCKING Result)**
2. 🎯 **Why 99% of Creators Get ${context.title || 'This'} Wrong**
3. 🚀 **The $0 vs $1,000 Challenge (Honest Breakdown)**

🎨 **Thumbnail Tip:** Use a strong facial expression on the left with Electric Lime (#D2F800) bold 3-word text overlay!`;
      suggestions = ['Outline a video script', 'How to repurpose this video?', 'Suggest B-roll ideas'];
    } else if (msg.includes('repurpose') || msg.includes('short') || msg.includes('reel')) {
      reply = `You can easily turn this into **3 Viral Shorts**:

1. 📱 **The 45s Hook Tease** (First 60 seconds with zoom-ins)
2. 💡 **The Step-by-Step Demo** (The core actionable hack)
3. 📊 **The Final Verdict & Cost Comparison** (The surprising conclusion)

Head to the **Content Family** tab to spawn these automatically!`;
      suggestions = ['Check Content Family tree', 'Write Short script now', 'Analyze audience comments'];
    } else {
      reply = `I'm your **Creator AI Assistant**! I can help you brainstorm high-CTR titles, write retention-focused hooks, structure full video blueprints, or repurpose long videos into viral Shorts.

What are you working on next?`;
      suggestions = ['Generate viral hooks', 'Suggest 5 video titles', 'Write a 60s Short script', 'Audit video freshness'];
    }

    return res.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString(),
        suggestions
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
