import User from '../models/User.js';
import Idea from '../models/Idea.js';
import Research from '../models/Research.js';
import ContentBlueprint from '../models/ContentBlueprint.js';
import Content from '../models/Content.js';
import ContentVersion from '../models/ContentVersion.js';
import Comment from '../models/Comment.js';
import AudienceFeedback from '../models/AudienceFeedback.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';
import ExternalSource from '../models/ExternalSource.js';

export const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    console.log('Database empty: Seeding diverse multi-niche CreatorHub studio data...');

    // 1. Seed 5 Studio Users
    const admin = await User.create({
      name: 'Studio Admin (System Manager)',
      email: 'admin@creatorhub.com',
      password: 'AdminPass123!',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      bio: 'CreatorHub System Administrator & Infrastructure Lead managing workspace security, API keys, and studio permissions.',
      preferences: { preferredPlatforms: ['youtube', 'tiktok', 'instagram', 'newsletter'], notificationsEnabled: true, theme: 'studio-light' },
    });

    const creator = await User.create({
      name: 'Elena Rostova',
      email: 'creator@creatorhub.com',
      password: 'Password123!',
      role: 'CREATOR',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Multi-platform creator covering tech, food, gaming, and storytelling for 850k subscribers.',
      preferences: { preferredPlatforms: ['youtube', 'tiktok', 'instagram'], notificationsEnabled: true, theme: 'studio-light' },
    });

    const producer = await User.create({
      name: 'Marcus Vance',
      email: 'producer@creatorhub.com',
      password: 'Password123!',
      role: 'PRODUCER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Lead Video Producer & Director specializing in high-retention pacing, audio design, and visual flow.',
      preferences: { preferredPlatforms: ['youtube', 'reels'], notificationsEnabled: true, theme: 'studio-light' },
    });

    const curator = await User.create({
      name: 'Sofia Chen',
      email: 'curator@creatorhub.com',
      password: 'Password123!',
      role: 'CURATOR',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'Community Lead & Trend Strategist analyzing viewer questions, feedback clusters, and viral formats.',
      preferences: { preferredPlatforms: ['reddit', 'youtube', 'tiktok'], notificationsEnabled: true, theme: 'studio-light' },
    });

    const editor = await User.create({
      name: 'Liam Gallagher',
      email: 'editor@creatorhub.com',
      password: 'Password123!',
      role: 'EDITOR',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Motion Graphics Artist & Short-Form Video Editor creating kinetic captions and VFX.',
      preferences: { preferredPlatforms: ['tiktok', 'youtube', 'reels'], notificationsEnabled: true, theme: 'studio-light' },
    });

    // 2. Seed Multi-Niche Discover Sources
    await ExternalSource.create([
      {
        sourceId: 'src-yt-01',
        title: 'I Built a 1,000 Player Civilization in Minecraft (Total Chaos)',
        url: 'https://youtube.com/watch?v=minecraft-civilization-experiment',
        platform: 'youtube',
        summary: 'Massive 30-day social experiment with 1,000 players creating economies, alliances, and battles.',
        author: 'PixelForge Gaming',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
        topicTags: ['gaming', 'minecraft', 'challenge', 'viral'],
        metrics: { views: 1400000, upvotes: 112000, commentsCount: 6800 },
        savedBy: [creator._id],
        isSaved: true
      },
      {
        sourceId: 'src-yt-02',
        title: '10-Minute Late Night Japanese Ramen (3 Grocery Store Hacks)',
        url: 'https://youtube.com/watch?v=10-min-japanese-ramen-hack',
        platform: 'youtube',
        summary: 'Turning instant noodles into rich, velvety restaurant broth using egg yolk, garlic oil, and kewpie.',
        author: 'Chef QuickEats',
        thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
        topicTags: ['cooking', 'recipes', 'quickmeals', 'food'],
        metrics: { views: 2100000, upvotes: 185000, commentsCount: 4200 },
        savedBy: [creator._id],
        isSaved: true
      },
      {
        sourceId: 'src-yt-03',
        title: 'I Used a $200 Android Phone for 30 Days (Did I Regret It?)',
        url: 'https://youtube.com/watch?v=budget-phone-30-days',
        platform: 'youtube',
        summary: 'Real-world comparison of camera quality, battery endurance, and daily apps between $200 vs $1,200 phones.',
        author: 'Tech Unfiltered',
        thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
        topicTags: ['tech', 'smartphones', 'budget', 'gadgets'],
        metrics: { views: 820000, upvotes: 54000, commentsCount: 3100 },
        savedBy: [creator._id],
        isSaved: false
      },
      {
        sourceId: 'src-yt-04',
        title: 'How I Traveled Across Japan on Just $40 a Day (Full Breakdown)',
        url: 'https://youtube.com/watch?v=japan-budget-solo-travel-guide',
        platform: 'youtube',
        summary: 'Capsule hotels, convenience store meals, and train pass hacks that make solo travel extremely cheap.',
        author: 'Nomad Chronicles',
        thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
        topicTags: ['travel', 'japan', 'budget', 'vlog'],
        metrics: { views: 1200000, upvotes: 96000, commentsCount: 5100 },
        savedBy: [creator._id],
        isSaved: true
      }
    ]);

    // 3. Seed Research Dossiers
    const researchFood = await Research.create({
      title: 'Quick Ramen Emulsion Chemistry: How Egg Yolk & Garlic Oil Emulsifies Broth',
      url: 'https://seriouseats.com/ramen-broth-emulsion-science',
      sourceName: 'Culinary Food Lab',
      sourceType: 'article',
      summary: 'Whisking a raw egg yolk with hot soup broth creates a stable emulsion that mimics 12-hour pork bone broth in 30 seconds.',
      keyPoints: [
        'Lecithin in egg yolk acts as a natural emulsifier between oil and boiling water.',
        'Adding grated raw garlic right before pouring boiling water releases allicin without turning bitter.',
        'Cost to prepare: $1.80 per bowl vs $18 at a ramen bar.'
      ],
      discussionInsights: ['Viewers consistently ask for exact liquid temperatures so the egg does not curdle.'],
      notes: 'Make sure to film the creamy broth swirl in slow-motion 60fps macro close-up!',
      tags: ['food', 'recipes', 'hacks', 'budget'],
      talkingPoints: [
        'The Secret Emulsion Hack: Whisk egg yolk + 1 tsp kewpie before pouring broth.',
        'Cost Comparison: $1.80 homemade vs $18 restaurant bowl.',
        'Pacing Tip: Show the finished bowl within the first 5 seconds to hook the viewer.'
      ],
      audienceQuotes: [
        '"Can you make a spicy vegetarian version next?"',
        '"The macro shot of the broth pouring was so satisfying!"'
      ],
      counterarguments: ['Is raw egg safe? Yes, the boiling water cooks and tempers the yolk instantly.'],
      createdBy: creator._id,
      addedBy: creator._id
    });

    // 4. Seed Ideas across Kanban stages
    const ideaRamen = await Idea.create({
      title: '10-Minute Japanese Street Ramen: 3 Grocery Store Hacks That Beat Takeout',
      summary: 'A fast, high-energy cooking video showing how to turn standard instant noodles into rich, restaurant-grade creamy broth.',
      stage: 'ready',
      priority: 'high',
      targetFormat: 'video',
      tags: ['cooking', 'food-hack', 'budget-eats', 'viral-recipe'],
      notes: 'Hook: Show the mouthwatering final bowl in first 3 seconds with steam and slow-motion broth swirl.',
      aiRefinements: {
        suggestedAngles: [
          'The $2 Ramen Hack That Tricked Food Critics',
          'Never Make Instant Noodles Normal Again',
          '3-Ingredient Late Night College Meal'
        ],
        targetAudienceInsights: 'College students, busy professionals, and home cooks wanting gourmet taste with 10-minute effort.',
        potentialHooks: [
          '"I tested every viral ramen hack on the internet so you do not ruin dinner."',
          '"This 10-minute trick makes a $1 pack of noodles taste like an $18 bowl in Tokyo."'
        ]
      },
      attachedResearchIds: [researchFood._id],
      createdBy: creator._id,
      order: 0
    });

    const ideaTravel = await Idea.create({
      title: 'I Traveled Across Japan for 7 Days on Just $40/Day (Solo Survival Guide)',
      summary: 'Budget travel breakdown showing exact costs, capsule hotel bookings, 7-Eleven feasts, and regional transit passes.',
      stage: 'developing',
      priority: 'high',
      targetFormat: 'video',
      tags: ['travel', 'japan', 'budget-guide', 'solo-vlog'],
      notes: 'Highlight the transparent budget sheet on screen throughout the trip.',
      createdBy: creator._id,
      order: 1
    });

    const ideaPhone = await Idea.create({
      title: 'I Swapped My $1,200 iPhone for a $200 Android Phone for 30 Days',
      summary: 'Honest creator challenge testing camera quality, battery endurance, editing on mobile, and social media uploads.',
      stage: 'inbox',
      priority: 'medium',
      targetFormat: 'video',
      tags: ['tech', 'gadgets', 'challenge', 'unfiltered'],
      createdBy: creator._id,
      order: 2
    });

    // 5. Seed Content Blueprint
    const blueprintRamen = await ContentBlueprint.create({
      title: '10-Minute Japanese Street Ramen: 3 Grocery Store Hacks',
      hook: 'This 10-minute grocery store trick makes a $1 pack of noodles taste like an $18 bowl in Tokyo — and all you need is an egg, garlic, and 1 secret ingredient.',
      targetAudience: 'Food lovers, busy students, and home cooks wanting quick, delicious meals.',
      platform: 'youtube',
      contentFormat: 'longform_video',
      tone: 'Energetic, appetizing, and educational',
      ideaId: ideaRamen._id,
      createdBy: creator._id,
      assignedProducerId: producer._id,
      status: 'ready',
      productionRequirements: {
        bRollNotes: '4K Macro close-ups of garlic sizzling, egg whisking, hot broth pouring, and final chopstick noodle pull.',
        graphicsNeeded: 'Ingredient cost counter on screen ($0.45 noodles, $0.30 egg, $0.20 garlic oil).',
        audioRequirements: 'Crisp ASMR sizzle and pour sound effects with upbeat lofi background music.',
        estimatedDurationMinutes: 8
      }
    });

    // 6. Seed Content in Production
    const contentPiece = await Content.create({
      title: '10-Minute Japanese Street Ramen: 3 Grocery Store Hacks',
      blueprintId: blueprintRamen._id,
      creatorId: creator._id,
      producerId: producer._id,
      platform: 'youtube',
      status: 'production',
      description: 'Filming high-energy cooking tutorial with 4K macro b-roll shots and on-screen cost breakdown.',
      tasks: [
        { title: 'Film 4K A-Roll Talking Head & Intro Hook', completed: true },
        { title: 'Capture 60fps Macro B-Roll (Broth Pour & Noodle Pull)', completed: true },
        { title: 'Sound Design & ASMR Sizzle Balancing', completed: true },
        { title: 'Color Grading & Appetite Warm Tone LUT', completed: true },
        { title: 'Render Final 4K Master Cut v2', completed: false }
      ]
    });

    // 7. Seed Version & Video Player
    const versionCut = await ContentVersion.create({
      contentId: contentPiece._id,
      versionNumber: 1,
      title: 'Draft Rough Cut v1 (Color Graded & Sound Mixed)',
      notes: 'Initial cut with dynamic zoom-ins, cost counters, and ASMR audio layers.',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      mediaType: 'video',
      durationSeconds: 596,
      uploadedBy: producer._id,
      isCurrent: true
    });

    contentPiece.versions = [versionCut._id];
    contentPiece.currentVersionId = versionCut._id;
    await contentPiece.save();

    // 8. Seed Timecoded Review Comments
    await Comment.create([
      {
        contentId: contentPiece._id,
        versionId: versionCut._id,
        authorId: creator._id,
        commentType: 'video_timestamp',
        timestampSeconds: 14.5,
        content: 'Trim 1 second off this intro pause so the broth reveal hits faster!',
        status: 'open'
      },
      {
        contentId: contentPiece._id,
        versionId: versionCut._id,
        authorId: producer._id,
        commentType: 'video_timestamp',
        timestampSeconds: 48.0,
        content: 'Added the $1.80 ingredient price badge animation here — looks super clean!',
        status: 'resolved'
      }
    ]);

    // 9. Seed Multi-Niche Audience Feedback
    await AudienceFeedback.create([
      {
        platform: 'youtube',
        authorName: 'Jessica M. (Home Cook)',
        content: 'Can you please make a 15-minute high-protein meal prep version of this for gym days?',
        sentiment: 'question',
        isQuestion: true,
        upvotes: 142,
        convertedToIdea: false
      },
      {
        platform: 'youtube',
        authorName: 'Alex Thorne',
        content: 'I tried this exact egg yolk hack last night and my roommates thought I ordered from a restaurant. 10/10!',
        sentiment: 'positive',
        isQuestion: false,
        upvotes: 389,
        convertedToIdea: false
      },
      {
        platform: 'reddit',
        authorName: 'u/travel_wanderer',
        content: 'For your Japan trip, which SIM card / eSIM did you use to stay connected in the countryside?',
        sentiment: 'question',
        isQuestion: true,
        upvotes: 88,
        convertedToIdea: false
      }
    ]);

    // 10. Seed Notifications & Activity
    await Notification.create({
      recipientId: creator._id,
      senderId: producer._id,
      type: 'review_request',
      title: 'New Video Cut Ready for Review',
      message: 'Marcus uploaded Draft Cut v1 for "10-Minute Japanese Street Ramen". Please review timestamps.',
      link: '/app/review'
    });

    await Activity.create({
      actorId: producer._id,
      actionType: 'version_created',
      entityType: 'content',
      entityId: contentPiece._id,
      entityTitle: contentPiece.title,
      description: 'Uploaded Draft Cut v1 with ASMR sound design to Review Studio.'
    });

    console.log('Default CreatorHub database seeded successfully with diverse multi-niche creator data!');
  } catch (err) {
    console.error('Auto-seed error:', err);
  }
};
