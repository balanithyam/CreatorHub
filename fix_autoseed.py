code = r"""import User from '../models/User.js';
import ExternalSource from '../models/ExternalSource.js';
import Research from '../models/Research.js';
import Idea from '../models/Idea.js';
import ContentBlueprint from '../models/ContentBlueprint.js';
import Content from '../models/Content.js';
import Comment from '../models/Comment.js';
import AudienceFeedback from '../models/AudienceFeedback.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';

export const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return;
    }

    console.log('Database empty: Seeding default CreatorHub data...');

    // 1. Users
    const creator = await User.create({
      name: 'Elena Rostova',
      email: 'creator@creatorhub.com',
      password: 'Password123!',
      role: 'CREATOR',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Full-time tech creator breaking down system architectures and AI workflows.',
      preferences: { theme: 'editorial', emailNotifications: true }
    });

    const producer = await User.create({
      name: 'Marcus Vance',
      email: 'producer@creatorhub.com',
      password: 'Password123!',
      role: 'PRODUCER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Senior video editor, colorist, and multi-track audio engineer.',
      preferences: { theme: 'editorial', emailNotifications: true }
    });

    const curator = await User.create({
      name: 'Sofia Chen',
      email: 'curator@creatorhub.com',
      password: 'Password123!',
      role: 'CURATOR',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      bio: 'Trend forecaster and community intelligence lead.',
      preferences: { theme: 'editorial', emailNotifications: true }
    });

    // 2. Sources
    const src1 = await ExternalSource.create({
      title: 'OpenAI Releases Reasoning Benchmarks for GPT-5 Preview',
      url: 'https://techcrunch.com/artificial-intelligence/gpt-5-reasoning-breakthroughs',
      platform: 'RSS_FEED',
      category: 'AI',
      summary: 'New test suites show a 40% jump in multi-step coding accuracy and latency reductions.',
      trendScore: 96,
      curatedBy: curator._id
    });

    const src2 = await ExternalSource.create({
      title: 'Why Top Creators are Leaving Traditional Social Feeds for Direct Newsletters',
      url: 'https://youtube.com/watch?v=mock-creator-economy-deep-dive',
      platform: 'YOUTUBE',
      category: 'Creator',
      summary: 'Algorithmic volatility is pushing long-form creators to build self-hosted content engines.',
      trendScore: 92,
      curatedBy: curator._id
    });

    const src3 = await ExternalSource.create({
      title: 'r/webdev: Are Server Actions in Next.js 15 Ready for Enterprise Scale?',
      url: 'https://reddit.com/r/webdev/comments/nextjs15_server_actions_scale',
      platform: 'REDDIT',
      category: 'Tech',
      summary: 'Heated debate on serverless latency, cold starts, and persistent connection patterns.',
      trendScore: 89,
      curatedBy: curator._id
    });

    // 3. Research
    const res1 = await Research.create({
      title: 'Next.js 15 Cache Invalidation & Server Action Benchmarks',
      content: 'Benchmarked 500 concurrent requests across Vercel and AWS Amplify. Key bottleneck is unmemoized database queries during revalidation.',
      category: 'Tech',
      sourceUrl: src3.url,
      keyPoints: [
        'Edge middleware cold starts add 80ms on non-cached routes',
        'Stale-while-revalidate pattern reduces perceived latency by 65%',
        'Action mutation payloads must be strictly sanitized'
      ],
      tags: ['nextjs', 'performance', 'react'],
      creatorId: creator._id
    });

    // 4. Ideas
    const idea1 = await Idea.create({
      title: 'Why Most Next.js 15 Apps Crash Under Peak Traffic',
      summary: 'Deep architectural teardown with live load testing on a 100k request cluster.',
      targetFormat: 'YOUTUBE_LONG',
      status: 'READY_FOR_BLUEPRINT',
      priority: 'HIGH',
      category: 'Tech',
      tags: ['nextjs', 'devops', 'fullstack'],
      creatorId: creator._id,
      sourceUrl: src3.url
    });

    const idea2 = await Idea.create({
      title: 'How to Build an AI Second Brain Using Local LLMs & Vector Search',
      summary: 'Hands-on tutorial showing Ollama + ChromaDB + TypeScript with zero cloud API costs.',
      targetFormat: 'YOUTUBE_LONG',
      status: 'DEVELOPING',
      priority: 'HIGH',
      category: 'AI',
      tags: ['ai', 'ollama', 'python'],
      creatorId: creator._id
    });

    const idea3 = await Idea.create({
      title: 'The 3-Hook Formula That Multiplied Our Watch Time by 240%',
      summary: 'Breakdown of retention graph analytics across 10 top engineering videos.',
      targetFormat: 'SHORT_REEL',
      status: 'INBOX',
      priority: 'MEDIUM',
      category: 'Creator',
      tags: ['growth', 'analytics', 'hooks'],
      creatorId: creator._id
    });

    // 5. Blueprints
    const bp1 = await ContentBlueprint.create({
      title: 'Why Most Next.js 15 Apps Crash Under Peak Traffic',
      ideaId: idea1._id,
      targetFormat: 'YOUTUBE_LONG',
      targetAudience: 'Full-stack engineers and technical founders',
      estimatedDuration: '12-14 minutes',
      hook: 'In the next 10 minutes, I am going to send 100,000 real HTTP requests to this brand new Next.js 15 deployment—and watch it catch fire.',
      sections: [
        {
          title: '0:00 - 0:30 Pattern Interrupt & Live Stress Test',
          duration: '30s',
          content: 'Show the Grafana dashboard spiking red. Establish the exact stakes and monetary cost of serverless runaway loops.'
        },
        {
          title: '0:30 - 3:00 The Fatal Server Action Mistake',
          duration: '2.5m',
          content: 'Live code review demonstrating how accidental unbounded database calls happen inside nested server components.'
        },
        {
          title: '3:00 - 8:00 The 3-Tier Production Architecture Fix',
          duration: '5m',
          content: 'Step 1: Connection pooling with PgBouncer. Step 2: Edge caching headers. Step 3: Circuit breaker middleware.'
        },
        {
          title: '8:00 - 11:30 Re-Running the 100k Benchmark',
          duration: '3.5m',
          content: 'Show green response times under 45ms. Terminal logs streaming with zero failed requests.'
        },
        {
          title: '11:30 - 13:00 Key Takeaways & Free Starter Template',
          duration: '1.5m',
          content: 'Call to action: Link to the GitHub repo and production checklist in the description.'
        }
      ],
      creatorId: creator._id
    });

    // 6. Content Items & Versions
    const content1 = await Content.create({
      title: 'Masterclass: Why Most Next.js 15 Apps Crash Under Peak Traffic',
      description: 'Master cut with dual camera angles, screen recordings, and kinetic lower-third graphics.',
      format: 'YOUTUBE_LONG',
      status: 'IN_REVIEW',
      blueprintId: bp1._id,
      creatorId: creator._id,
      assignedProducerId: producer._id,
      tasks: [
        { title: 'Record A-Roll talking head in 4K', completed: true },
        { title: 'Capture 60fps terminal load test screen recording', completed: true },
        { title: 'Audio denoise, EQ & loudness normalization (-14 LUFS)', completed: true },
        { title: 'Animate Grafana spike telemetry graphics', completed: true },
        { title: 'Final color grade and export Cut v2', completed: false }
      ],
      versions: [
        {
          versionNumber: 1,
          mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          mediaType: 'VIDEO',
          notes: 'Rough assembly cut with temp audio leveling and raw terminal footage.',
          uploadedBy: producer._id,
          createdAt: new Date(Date.now() - 86400000)
        },
        {
          versionNumber: 2,
          mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          mediaType: 'VIDEO',
          notes: 'Color graded, trimmed 4s awkward pause at 03:14, and updated lower third typography.',
          uploadedBy: producer._id,
          createdAt: new Date()
        }
      ]
    });

    // 7. Derivative Child Content
    await Content.create({
      title: '45s Reel: The 1 Mistake That Destroys Next.js Performance',
      description: 'Vertical 9:16 cut optimized for YouTube Shorts and Instagram Reels with kinetic subtitles.',
      format: 'SHORT_REEL',
      status: 'PRODUCTION',
      parentContentId: content1._id,
      creatorId: creator._id,
      assignedProducerId: producer._id,
      tasks: [
        { title: 'Crop to vertical 1080x1920 with centered subject track', completed: true },
        { title: 'Generate bold kinetic subtitle animation', completed: false }
      ]
    });

    // 8. Review Comments
    await Comment.create({
      contentId: content1._id,
      author: creator._id,
      versionNumber: 2,
      timestampSeconds: 14,
      text: 'The opening Grafana sound effect is slightly too loud compared to the voiceover. Lower SFX by -3dB.',
      category: 'AUDIO',
      resolved: false
    });

    await Comment.create({
      contentId: content1._id,
      author: producer._id,
      versionNumber: 2,
      timestampSeconds: 195,
      text: 'Added the zoom-in on the terminal benchmark command as requested.',
      category: 'GRAPHIC',
      resolved: true
    });

    // 9. Feedback (Audience)
    await AudienceFeedback.create({
      authorName: 'David K. (Senior React Dev)',
      content: 'Could you do a comparison showing how Remix/React Router 7 handles the same 100k load test?',
      sourcePlatform: 'YOUTUBE',
      sentiment: 'QUESTION',
      convertedToIdea: false,
      extractedTopics: ['remix', 'react-router', 'benchmarking']
    });

    await AudienceFeedback.create({
      authorName: 'Sarah Lin',
      content: 'This was the clearest explanation of database connection pooling I have seen all year. Subscribed!',
      sourcePlatform: 'YOUTUBE',
      sentiment: 'POSITIVE',
      convertedToIdea: false,
      extractedTopics: ['connection-pooling', 'praise']
    });

    // 10. Activities
    await Activity.create({
      user: creator._id,
      action: 'CREATED_BLUEPRINT',
      description: 'created a new blueprint for "Why Most Next.js 15 Apps Crash Under Peak Traffic"',
      targetId: bp1._id,
      targetType: 'Blueprint'
    });

    await Activity.create({
      user: producer._id,
      action: 'UPLOADED_VERSION',
      description: 'uploaded Cut v2 for review',
      targetId: content1._id,
      targetType: 'Content'
    });

    // 11. Notifications
    await Notification.create({
      recipient: creator._id,
      title: 'New Video Cut Ready for Review',
      message: 'Marcus Vance uploaded Cut v2 for "Why Most Next.js 15 Apps Crash Under Peak Traffic".',
      type: 'REVIEW',
      link: `/app/review?contentId=${content1._id}`,
      read: false
    });

    console.log('Default CreatorHub database seeded successfully!');
  } catch (error) {
    console.error('Error during auto-seed:', error);
  }
};
"""

with open(r'D:\CreatorHub\backend\utils\autoSeed.js', 'w', encoding='utf-8') as f:
    f.write(code.strip())

print("Rewrote backend/utils/autoSeed.js successfully!")
