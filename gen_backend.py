import os
import subprocess

seed_code = r'''import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.js';

import User from '../models/User.js';
import ExternalSource from '../models/ExternalSource.js';
import Research from '../models/Research.js';
import Idea from '../models/Idea.js';
import ContentBlueprint from '../models/ContentBlueprint.js';
import Content from '../models/Content.js';
import ContentVersion from '../models/ContentVersion.js';
import Asset from '../models/Asset.js';
import Comment from '../models/Comment.js';
import AudienceFeedback from '../models/AudienceFeedback.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Clearing old collections...');
    await Promise.all([
      User.deleteMany({}),
      ExternalSource.deleteMany({}),
      Research.deleteMany({}),
      Idea.deleteMany({}),
      ContentBlueprint.deleteMany({}),
      Content.deleteMany({}),
      ContentVersion.deleteMany({}),
      Asset.deleteMany({}),
      Comment.deleteMany({}),
      AudienceFeedback.deleteMany({}),
      Notification.deleteMany({}),
      Activity.deleteMany({})
    ]);

    console.log('Creating 3 Primary Users...');
    const creator = await User.create({
      name: 'Elena Rostova',
      email: 'creator@creatorhub.com',
      password: 'Password123!',
      role: 'CREATOR',
      bio: 'Tech Essayist and Creative Director producing deep dives on AI, digital culture, and software architecture.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      preferences: {
        preferredPlatforms: ['youtube', 'newsletter'],
        notificationsEnabled: true,
        theme: 'studio-light'
      }
    });

    const producer = await User.create({
      name: 'Marcus Vance',
      email: 'producer@creatorhub.com',
      password: 'Password123!',
      role: 'PRODUCER',
      bio: 'Senior Video Producer and Motion Colorist specializing in high-paced visual essays and kinetic typography.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      preferences: {
        preferredPlatforms: ['youtube', 'instagram'],
        notificationsEnabled: true,
        theme: 'studio-light'
      }
    });

    const curator = await User.create({
      name: 'Siddharth Rao',
      email: 'curator@creatorhub.com',
      password: 'Password123!',
      role: 'CURATOR',
      bio: 'Research Director scanning niche developer forums, arXiv papers, and emerging creative patterns.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      preferences: {
        preferredPlatforms: ['reddit', 'newsletter'],
        notificationsEnabled: true,
        theme: 'studio-light'
      }
    });

    console.log('Creating Curated Live Feeds & External Sources...');
    const source1 = await ExternalSource.create({
      sourceId: 'yt_multiagent_2026',
      title: 'Autonomous Multi-Agent Frameworks: The Next Software Paradigm',
      url: 'https://www.youtube.com/watch?v=sample-multiagent',
      platform: 'youtube',
      summary: 'A deep-dive into how autonomous agent swarms collaborate, handle state, and replace standard procedural microservices.',
      author: 'AI Architecture Daily',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      publishedAt: new Date(Date.now() - 3600000 * 6),
      metrics: { views: 92400, upvotes: 6200, commentsCount: 780, sentimentScore: 0.88 },
      topicTags: ['AI Agents', 'Automation', 'Software Architecture'],
      isSaved: true,
      savedBy: [curator._id, creator._id]
    });

    const source2 = await ExternalSource.create({
      sourceId: 'rd_editorial_brutalism',
      title: 'Why editorial typography and warm brutalism are replacing generic SaaS design in 2026',
      url: 'https://reddit.com/r/webdev/comments/editorial_design_boom',
      platform: 'reddit',
      summary: 'Creators and frontend developers share how warm palettes, distinctive fonts, and tactile UI patterns dramatically lift user engagement.',
      author: 'u/modern_artisan',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
      publishedAt: new Date(Date.now() - 3600000 * 14),
      metrics: { views: 42000, upvotes: 2850, commentsCount: 420, sentimentScore: 0.92 },
      topicTags: ['Design', 'UI/UX', 'Trends'],
      isSaved: true,
      savedBy: [creator._id]
    });

    const source3 = await ExternalSource.create({
      sourceId: 'news_cascading_media',
      title: 'Independent Creators Shift to Multi-Format Content Cascades to Triple Revenue',
      url: 'https://techradar.com/news/creator-economy-cascading-formats',
      platform: 'news',
      summary: 'Research shows turning 1 pillar video into 4 carousels, 3 shorts, and a newsletter yields 320% higher organic reach and engagement.',
      author: 'Media Strategy Weekly',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      publishedAt: new Date(Date.now() - 3600000 * 26),
      metrics: { views: 65000, upvotes: 1400, commentsCount: 190, sentimentScore: 0.79 },
      topicTags: ['Creator Economy', 'Strategy', 'Repurposing'],
      isSaved: false
    });

    console.log('Creating Research Wall Items...');
    const research1 = await Research.create({
      title: 'Multi-Agent Frameworks Architecture Benchmark',
      url: 'https://github.com/trending/agents-benchmark',
      sourceName: 'GitHub AI Benchmarks',
      sourceType: 'article',
      tags: ['AI Swarms', 'Latency Benchmarks', 'Tool Calling'],
      notes: 'Key takeaway: Agentic systems with deterministic validation loops beat single-prompt systems 4-to-1 in code accuracy.',
      summary: 'Comprehensive testing of tool-calling agents across 50 real-world software refactoring scenarios.',
      keyPoints: [
        'Deterministic validation loops prevent infinite hallucination cascades',
        'Human-in-the-loop review studios increase accuracy to 99.2%',
        'Visual execution timelines reduce debugging time by 60%'
      ],
      discussionInsights: [
        'Developers want visual inspector trees to understand why subagents made particular tool decisions'
      ],
      addedBy: curator._id,
      sourceRef: source1._id
    });

    const research2 = await Research.create({
      title: 'Audience Attention Span and Hook Retention Study',
      url: 'https://creatorstudies.org/reports/hook-retention-2026',
      sourceName: 'Creator Studies Institute',
      sourceType: 'article',
      tags: ['Audience Psychology', 'Hook Theory', 'Pacing'],
      notes: 'First 4 seconds must establish the stakes, tension, or paradoxical question before any intro music.',
      summary: 'Analysis of 1,000 top performing video essays on YouTube and vertical short platforms.',
      keyPoints: [
        'Visual pattern interrupts every 3.5 seconds maintain 80%+ retention past 1 minute',
        'Question-based hooks retain 22% more viewers than bold statements alone'
      ],
      addedBy: curator._id
    });

    console.log('Creating Ideas in Kanban Stages...');
    const idea1 = await Idea.create({
      title: 'How AI Agents Actually Talk To Each Other (Visualized)',
      summary: 'An illustrated deep-dive explaining how agent communication protocols, JSON schemas, and state trees work in practice.',
      stage: 'ready',
      priority: 'high',
      targetFormat: 'video',
      tags: ['AI Agents', 'Visual Essay', 'Deep Dive'],
      sourceRef: source1._id,
      attachedResearchIds: [research1._id],
      createdBy: creator._id,
      assignedTo: producer._id,
      aiRefinements: {
        suggestedAngles: [
          'The Newsroom Analogy: Editor, Fact-checker, and Lead Reporter agents',
          'Live Terminal trace of JSON schema handoffs'
        ],
        targetAudienceInsights: 'Software engineers, tech leads, tech enthusiasts curious about agent architecture',
        potentialHooks: [
          'What if your software team was not made of humans, but 10 autonomous AI models chatting over JSON at 2 AM?',
          'Inside the secret communication protocol running modern AI agent swarms'
        ]
      }
    });

    const idea2 = await Idea.create({
      title: 'The Death of Boring SaaS: Why Personality-Driven UI Wins',
      summary: 'Deconstructing why generic blue and purple dashboards fail to convert and how bold editorial craft wins loyal creators.',
      stage: 'developing',
      priority: 'medium',
      targetFormat: 'carousel',
      tags: ['Design', 'Brutalism', 'Product Design'],
      sourceRef: source2._id,
      createdBy: creator._id,
      aiRefinements: {
        suggestedAngles: ['Warm palette vs generic dark-mode fatigue', 'Tactile typography analysis'],
        targetAudienceInsights: 'Product designers, indie hackers, creative directors',
        potentialHooks: ['Why every SaaS looks like a 2021 template and how to stand out']
      }
    });

    const idea3 = await Idea.create({
      title: 'Content Cascading Blueprint: Turn 1 Pillar Video into 12 Assets',
      summary: 'Step-by-step workflow for creators to repurpose long-form videos into micro-content without losing quality.',
      stage: 'production',
      priority: 'high',
      targetFormat: 'multi',
      tags: ['Strategy', 'Workflow', 'Creator Economy'],
      createdBy: creator._id,
      assignedTo: producer._id
    });

    const idea4 = await Idea.create({
      title: 'Why Local AI Models Are Taking Over Personal Computers',
      summary: 'Investigating small 4B-8B parameter models running quantized on local silicon with zero cloud dependency.',
      stage: 'inbox',
      priority: 'low',
      targetFormat: 'video',
      tags: ['Edge AI', 'Privacy', 'Hardware'],
      createdBy: curator._id
    });

    console.log('Creating Editorial Blueprints...');
    const blueprint1 = await ContentBlueprint.create({
      title: 'Master Blueprint: Autonomous Multi-Agent Frameworks Visualized',
      hook: 'What if your software team was not made of humans, but 10 autonomous AI models chatting over JSON at 2 AM?',
      targetAudience: 'Tech leads, AI engineers, indie builders, product strategists',
      platform: 'youtube',
      format: 'video',
      narrativeBlocks: [
        { blockType: 'hook', heading: 'Hook & The Paradox', content: 'Introduce the problem of human communication bottleneck vs multi-agent speed.', durationSeconds: 75 },
        { blockType: 'context', heading: 'How Agent Protocols Work', content: 'Deconstruct JSON message passing and shared context memory trees.', durationSeconds: 210 },
        { blockType: 'example', heading: 'Live Case Demonstration', content: 'Show an autonomous refactor swarm detecting and fixing an async race condition in real-time.', durationSeconds: 270 },
        { blockType: 'takeaway', heading: 'Actionable Takeaways', content: 'Explain how developers can configure their first local agent loop today.', durationSeconds: 120 }
      ],
      productionRequirements: {
        bRollSuggestions: [
          'Custom 2D animated flowcharts showing JSON packet transfer',
          'Kinetic typography for code diffs and token streams',
          'Warm editorial color palette matching CreatorHub theme'
        ],
        visualStyleNotes: 'Warm brutalist typography, high contrast, smooth camera pans',
        estimatedDurationMinutes: 11,
        deadline: new Date(Date.now() + 86400000 * 5)
      },
      attachedResearchIds: [research1._id],
      ideaId: idea1._id,
      createdBy: creator._id,
      assignedProducerId: producer._id,
      status: 'in_production'
    });

    console.log('Creating Pillar Content & Production Items...');
    const contentPillar = await Content.create({
      title: 'How AI Agents Talk To Each Other (Master 4K Video Essay)',
      blueprintId: blueprint1._id,
      creatorId: creator._id,
      producerId: producer._id,
      platform: 'youtube',
      format: 'video',
      currentVersionNumber: 2,
      status: 'in_review',
      parentContentId: null,
      derivativeType: 'original',
      tags: ['AI Agents', 'Software', 'YouTube Pillar']
    });

    console.log('Creating Content Versions with Media...');
    const version1 = await ContentVersion.create({
      contentId: contentPillar._id,
      versionNumber: 1,
      title: 'Rough Cut v1 (Draft VO)',
      notes: 'Initial assembly cut with voiceover draft and raw animation placeholders.',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      mediaType: 'video',
      durationSeconds: 15,
      uploadedBy: producer._id,
      checklist: [
        { id: 'c1', label: 'Record voiceover narration', completed: true, completedBy: creator._id },
        { id: 'c2', label: 'Produce 2D motion graphics diagram', completed: true, completedBy: producer._id },
        { id: 'c3', label: 'Color grade A-roll', completed: false }
      ],
      isCurrent: false
    });

    const version2 = await ContentVersion.create({
      contentId: contentPillar._id,
      versionNumber: 2,
      title: 'Master Cut v2 (Final Color & Motion)',
      notes: 'Cut v2: Integrated motion typography, adjusted hook pacing, normalized VO loudness.',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      mediaType: 'video',
      durationSeconds: 60,
      uploadedBy: producer._id,
      checklist: [
        { id: 'c1', label: 'Record voiceover narration', completed: true, completedBy: creator._id },
        { id: 'c2', label: 'Produce 2D motion graphics diagram', completed: true, completedBy: producer._id },
        { id: 'c3', label: 'Color grade A-roll and apply warm film grain', completed: true, completedBy: producer._id },
        { id: 'c4', label: 'Sound design (whooshes, keyboard clicks, ambient pad)', completed: false }
      ],
      isCurrent: true
    });

    console.log('Creating Media Assets...');
    await Asset.create({
      name: 'Agent Architecture SVG Diagram v2',
      originalName: 'agent_arch_v2.jpg',
      fileType: 'image',
      mimeType: 'image/jpeg',
      size: 1420000,
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      tags: ['Diagram', 'Architecture', 'AI Flow'],
      uploadedBy: creator._id,
      contentId: contentPillar._id,
      blueprintId: blueprint1._id
    });

    console.log('Creating Review Studio Comments...');
    await Comment.create({
      contentId: contentPillar._id,
      versionId: version2._id,
      authorId: creator._id,
      commentType: 'video_timestamp',
      timestampSec: 14.5,
      body: 'The kinetic typography at 0:14 moves slightly too fast for viewers on mobile screens. Can we slow down the word reveal by 20%?',
      resolved: false
    });

    await Comment.create({
      contentId: contentPillar._id,
      versionId: version2._id,
      authorId: producer._id,
      commentType: 'video_timestamp',
      timestampSec: 38.0,
      body: 'Good catch Elena! Adjusted the easing curve and extended the hold frame. Check 0:38 as well for the sound sync.',
      resolved: true,
      resolvedBy: producer._id,
      resolvedAt: new Date()
    });

    console.log('Creating Derivative Child Content for Content Family Tree...');
    const childShort = await Content.create({
      title: 'Agent Swarms in 60 Seconds (Shorts/Reels Cut)',
      platform: 'instagram',
      format: 'short',
      status: 'in_production',
      parentContentId: contentPillar._id,
      derivativeType: 'short',
      creatorId: creator._id,
      producerId: producer._id,
      reuseNotes: 'Cut from Section 2 & 3 with fast vertical kinetic text overlays.',
      tags: ['Shorts', 'Reels', 'Vertical']
    });

    const childCarousel = await Content.create({
      title: '10 Architectural Rules for Multi-Agent Systems (Carousel)',
      platform: 'newsletter',
      format: 'carousel',
      status: 'draft',
      parentContentId: contentPillar._id,
      derivativeType: 'thread',
      creatorId: creator._id,
      reuseNotes: '10-slide distillation of Section 2 with code snippets.',
      tags: ['Carousel', 'LinkedIn', 'Deep Dive']
    });

    console.log('Creating Audience Feedback Items...');
    await AudienceFeedback.create({
      platform: 'youtube',
      authorName: 'AlexChen_Dev',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      content: 'Could you do a video on how to handle state drift when 5 agents are writing to the same PostgreSQL DB simultaneously? We struggle with concurrency conflicts.',
      sentiment: 'content_request',
      isContentRequest: true,
      isQuestion: true,
      upvotes: 340,
      extractedTopic: 'Multi-agent Database Concurrency & State Drift',
      status: 'new'
    });

    await AudienceFeedback.create({
      platform: 'twitter',
      authorName: '@sarah_builds',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'I love your visual breakdowns! What software do you use for those warm editorial flowcharts?',
      sentiment: 'question',
      isQuestion: true,
      upvotes: 125,
      extractedTopic: 'Editorial Design & Diagram Tooling',
      status: 'new'
    });

    await AudienceFeedback.create({
      platform: 'community',
      authorName: 'Community Poll #42',
      content: 'Next Topic Vote: Local Offline AI Models (82% votes) vs Serverless GPU Clusters (18% votes)',
      sentiment: 'positive',
      upvotes: 1800,
      extractedTopic: 'Local Offline AI Models',
      convertedToIdeaId: idea4._id,
      status: 'converted'
    });

    console.log('Creating Notifications & Activity Logs...');
    await Notification.create({
      recipientId: creator._id,
      senderId: producer._id,
      type: 'new_version',
      title: 'New Cut Ready for Review',
      message: 'Marcus uploaded Cut v2 of "How AI Agents Talk To Each Other".',
      link: /app/review?contentId=,
      read: false
    });

    await Notification.create({
      recipientId: creator._id,
      senderId: curator._id,
      type: 'audience_request',
      title: 'Trending Discovery Added',
      message: 'Siddharth saved "Autonomous Multi-Agent Frameworks" to the Discovery board.',
      link: '/app/discover',
      read: false
    });

    await Activity.create({
      actorId: creator._id,
      actionType: 'idea_created',
      entityType: 'idea',
      entityId: idea1._id,
      entityTitle: idea1.title,
      description: 'Elena created idea "How AI Agents Actually Talk To Each Other"'
    });

    await Activity.create({
      actorId: producer._id,
      actionType: 'version_created',
      entityType: 'version',
      entityId: version2._id,
      entityTitle: 'Master Cut v2',
      description: 'Marcus uploaded Master Cut v2 for review'
    });

    console.log('✅ Database Seeded Successfully with rich sample data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
}

seedDatabase();
'''

os.makedirs('backend/scripts', exist_ok=True)
with open('backend/scripts/seed.js', 'w', encoding='utf-8') as f:
    f.write(seed_code)
print('backend/scripts/seed.js written successfully')
