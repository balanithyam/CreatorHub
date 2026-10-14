code = r"""import User from '../models/User.js';
import ExternalSource from '../models/ExternalSource.js';
import Research from '../models/Research.js';
import Idea from '../models/Idea.js';
import ContentBlueprint from '../models/ContentBlueprint.js';
import Content from '../models/Content.js';
import ContentVersion from '../models/ContentVersion.js';
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
      preferredPlatforms: ['youtube', 'newsletter', 'podcast']
    });

    const producer = await User.create({
      name: 'Marcus Vance',
      email: 'producer@creatorhub.com',
      password: 'Password123!',
      role: 'PRODUCER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Senior video editor, colorist, and multi-track audio engineer.',
      preferredPlatforms: ['youtube', 'tiktok']
    });

    const curator = await User.create({
      name: 'Sofia Chen',
      email: 'curator@creatorhub.com',
      password: 'Password123!',
      role: 'CURATOR',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      bio: 'Trend forecaster and community intelligence lead.',
      preferredPlatforms: ['reddit', 'twitter']
    });

    // 2. Sources
    const src1 = await ExternalSource.create({
      sourceId: 'src-001',
      title: 'OpenAI Releases Reasoning Benchmarks for GPT-5 Preview',
      url: 'https://techcrunch.com/artificial-intelligence/gpt-5-reasoning-breakthroughs',
      platform: 'news',
      summary: 'New test suites show a 40% jump in multi-step coding accuracy and latency reductions.',
      topicTags: ['ai', 'benchmarks', 'openai']
    });

    const src2 = await ExternalSource.create({
      sourceId: 'src-002',
      title: 'Why Top Creators are Leaving Traditional Social Feeds for Direct Newsletters',
      url: 'https://youtube.com/watch?v=mock-creator-economy-deep-dive',
      platform: 'youtube',
      summary: 'Algorithmic volatility is pushing long-form creators to build self-hosted content engines.',
      topicTags: ['creators', 'newsletters', 'youtube']
    });

    const src3 = await ExternalSource.create({
      sourceId: 'src-003',
      title: 'r/webdev: Are Server Actions in Next.js 15 Ready for Enterprise Scale?',
      url: 'https://reddit.com/r/webdev/comments/nextjs15_server_actions_scale',
      platform: 'reddit',
      summary: 'Heated debate on serverless latency, cold starts, and persistent connection patterns.',
      topicTags: ['nextjs', 'react', 'webdev']
    });

    // 3. Research
    const res1 = await Research.create({
      title: 'Next.js 15 Cache Invalidation & Server Action Benchmarks',
      url: src3.url,
      sourceName: 'Reddit r/webdev & Vercel RFC',
      sourceType: 'discussion',
      summary: 'Benchmarked 500 concurrent requests across Vercel and AWS Amplify. Key bottleneck is unmemoized database queries during revalidation.',
      keyPoints: [
        'Edge middleware cold starts add 80ms on non-cached routes',
        'Stale-while-revalidate pattern reduces perceived latency by 65%',
        'Action mutation payloads must be strictly sanitized'
      ],
      discussionInsights: [
        'Developers prefer dedicated connection poolers like PgBouncer for Next.js server actions',
        'Cache tagging requires deterministic keys'
      ],
      tags: ['nextjs', 'performance', 'react'],
      addedBy: creator._id,
      sourceRef: src3._id
    });

    // 4. Ideas
    const idea1 = await Idea.create({
      title: 'Why Most Next.js 15 Apps Crash Under Peak Traffic',
      summary: 'Deep architectural teardown with live load testing on a 100k request cluster.',
      stage: 'ready',
      targetFormat: 'video',
      priority: 'high',
      tags: ['nextjs', 'devops', 'fullstack'],
      createdBy: creator._id,
      sourceRef: src3._id
    });

    const idea2 = await Idea.create({
      title: 'How to Build an AI Second Brain Using Local LLMs & Vector Search',
      summary: 'Hands-on tutorial showing Ollama + ChromaDB + TypeScript with zero cloud API costs.',
      stage: 'developing',
      targetFormat: 'video',
      priority: 'high',
      tags: ['ai', 'ollama', 'python'],
      createdBy: creator._id
    });

    const idea3 = await Idea.create({
      title: 'The 3-Hook Formula That Multiplied Our Watch Time by 240%',
      summary: 'Breakdown of retention graph analytics across 10 top engineering videos.',
      stage: 'inbox',
      targetFormat: 'short',
      priority: 'medium',
      tags: ['growth', 'analytics', 'hooks'],
      createdBy: creator._id
    });

    // 5. Blueprints
    const bp1 = await ContentBlueprint.create({
      title: 'Why Most Next.js 15 Apps Crash Under Peak Traffic',
      ideaId: idea1._id,
      hook: 'In the next 10 minutes, I am going to send 100,000 real HTTP requests to this brand new Next.js 15 deployment—and watch it catch fire.',
      targetAudience: 'Full-stack engineers and technical founders',
      primaryPlatform: 'youtube',
      formatType: 'longform_video',
      estimatedDurationMinutes: 12,
      blocks: [
        {
          order: 1,
          type: 'hook',
          title: 'Pattern Interrupt & Live Stress Test',
          narrativeContent: 'Show the Grafana dashboard spiking red. Establish the exact stakes and monetary cost of serverless runaway loops.',
          durationSeconds: 30,
          visualCue: 'Screen record terminal load test + webcam shock reaction'
        },
        {
          order: 2,
          type: 'problem',
          title: 'The Fatal Server Action Mistake',
          narrativeContent: 'Live code review demonstrating how accidental unbounded database calls happen inside nested server components.',
          durationSeconds: 150,
          visualCue: 'VS Code split screen with Node flamegraph'
        },
        {
          order: 3,
          type: 'solution',
          title: 'The 3-Tier Production Architecture Fix',
          narrativeContent: 'Step 1: Connection pooling with PgBouncer. Step 2: Edge caching headers. Step 3: Circuit breaker middleware.',
          durationSeconds: 300,
          visualCue: 'Excalidraw system diagram animation'
        }
      ],
      createdBy: creator._id,
      assignedProducerId: producer._id,
      status: 'in_production'
    });

    // 6. Content Items & Versions
    const content1 = await Content.create({
      title: 'Masterclass: Why Most Next.js 15 Apps Crash Under Peak Traffic',
      blueprintId: bp1._id,
      creatorId: creator._id,
      producerId: producer._id,
      platform: 'youtube',
      format: 'video',
      status: 'in_review',
      currentVersionNumber: 2,
      tags: ['nextjs', 'architecture', 'load-testing']
    });

    const v1 = await ContentVersion.create({
      contentId: content1._id,
      versionNumber: 1,
      title: 'Rough Assembly Cut v1',
      notes: 'Rough assembly cut with temp audio leveling and raw terminal footage.',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      mediaType: 'video',
      durationSeconds: 680,
      uploadedBy: producer._id,
      checklist: [
        { item: 'A-Roll synced', completed: true },
        { item: 'Audio denoised', completed: true },
        { item: 'Color graded', completed: false }
      ]
    });

    const v2 = await ContentVersion.create({
      contentId: content1._id,
      versionNumber: 2,
      title: 'Refined Cut v2 with Kinetic Graphics',
      notes: 'Color graded, trimmed 4s awkward pause at 03:14, and updated lower third typography.',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      mediaType: 'video',
      durationSeconds: 674,
      uploadedBy: producer._id,
      isCurrent: true,
      checklist: [
        { item: 'A-Roll synced', completed: true },
        { item: 'Audio normalized (-14 LUFS)', completed: true },
        { item: 'Color graded', completed: true },
        { item: 'Thumbnail render', completed: true }
      ]
    });

    // 7. Derivative Child Content
    await Content.create({
      title: '45s Reel: The 1 Mistake That Destroys Next.js Performance',
      creatorId: creator._id,
      producerId: producer._id,
      platform: 'instagram',
      format: 'short',
      status: 'in_production',
      parentContentId: content1._id,
      derivativeType: 'reel',
      reuseNotes: 'Cropped 9:16 vertical hook from master timestamp 02:15-03:00'
    });

    // 8. Review Comments
    await Comment.create({
      contentId: content1._id,
      versionId: v2._id,
      authorId: creator._id,
      type: 'video_timestamp',
      timestampSec: 14,
      body: 'The opening Grafana sound effect is slightly too loud compared to the voiceover. Lower SFX by -3dB.',
      resolved: false
    });

    await Comment.create({
      contentId: content1._id,
      versionId: v2._id,
      authorId: producer._id,
      type: 'video_timestamp',
      timestampSec: 195,
      body: 'Added the zoom-in on the terminal benchmark command as requested.',
      resolved: true
    });

    // 9. Feedback (Audience)
    await AudienceFeedback.create({
      authorName: 'David K. (Senior React Dev)',
      content: 'Could you do a comparison showing how Remix/React Router 7 handles the same 100k load test?',
      platform: 'youtube',
      sentiment: 'positive',
      isQuestion: true,
      upvotes: 42,
      extractedTopic: 'remix vs nextjs'
    });

    await AudienceFeedback.create({
      authorName: 'Sarah Lin',
      content: 'This was the clearest explanation of database connection pooling I have seen all year. Subscribed!',
      platform: 'youtube',
      sentiment: 'positive',
      isQuestion: false,
      upvotes: 89,
      extractedTopic: 'connection-pooling'
    });

    // 10. Activities
    await Activity.create({
      actorId: creator._id,
      actionType: 'blueprint_created',
      entityType: 'blueprint',
      entityId: bp1._id,
      entityTitle: bp1.title,
      description: 'created a new blueprint for "Why Most Next.js 15 Apps Crash Under Peak Traffic"'
    });

    await Activity.create({
      actorId: producer._id,
      actionType: 'version_uploaded',
      entityType: 'content',
      entityId: content1._id,
      entityTitle: content1.title,
      description: 'uploaded Cut v2 with kinetic graphics'
    });

    // 11. Notifications
    await Notification.create({
      recipientId: creator._id,
      senderId: producer._id,
      type: 'review_comment',
      title: 'New Video Cut Ready for Review',
      message: 'Marcus Vance uploaded Cut v2 for "Why Most Next.js 15 Apps Crash Under Peak Traffic".',
      link: `/app/review?contentId=${content1._id}`,
      read: false
    });

    console.log('Default CreatorHub database seeded successfully with 100% compliant models!');
  } catch (error) {
    console.error('Error during auto-seed:', error);
  }
};
"""

with open(r'D:\CreatorHub\backend\utils\autoSeed.js', 'w', encoding='utf-8') as f:
    f.write(code.strip())

print("Rewrote backend/utils/autoSeed.js with 100% matching schema!")
