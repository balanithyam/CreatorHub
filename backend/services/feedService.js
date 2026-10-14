import axios from 'axios';

// Map niches to representative subreddits and search terms
const NICHE_MAP = {
  all: { subreddits: 'youtube+videos+InternetIsBeautiful+gadgets', search: 'trending creator viral videos' },
  tech: { subreddits: 'technology+gadgets+android+apple+smartphones', search: 'tech review gadgets future technology' },
  gaming: { subreddits: 'gaming+pcmasterrace+Games+Minecraft', search: 'gaming highlights gameplay viral walkthrough' },
  food: { subreddits: 'recipes+FoodPorn+AskCulinary+Cooking', search: 'quick delicious recipes street food viral cooking' },
  fitness: { subreddits: 'fitness+bodyweightfitness+nutrition', search: 'home workout fitness routine transformation' },
  beauty: { subreddits: 'MakeupAddiction+SkincareAddiction+beauty', search: 'skincare routine GRWM beauty hacks' },
  travel: { subreddits: 'travel+solotravel+backpacking', search: 'budget travel hidden gems city guide' },
  finance: { subreddits: 'personalfinance+SideHustle+financialindependence', search: 'passive income finance tips side hustle' },
  entertainment: { subreddits: 'movies+television+popculturechat', search: 'cinema breakdown video essay entertainment' }
};

// Rich, multi-niche curated fallback library
const MULTI_NICHE_TRENDS = [
  {
    niche: 'gaming',
    sourceId: 'gm-001',
    title: 'I Built a 1,000 Player Civilization in Minecraft (Total Chaos)',
    url: 'https://youtube.com/watch?v=minecraft-civilization-experiment',
    platform: 'YOUTUBE',
    summary: 'A massive social experiment where 1,000 players formed factions, economies, and wars over 30 days.',
    author: 'PixelForge Studios',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    metrics: { views: '1.4M', likes: '112K', platform: 'YouTube' },
    trendScore: 99,
    topicTags: ['gaming', 'minecraft', 'challenge', 'storytelling']
  },
  {
    niche: 'tech',
    sourceId: 'tc-001',
    title: 'I Used a $200 Android Phone for 30 Days (Did I Regret It?)',
    url: 'https://youtube.com/watch?v=budget-phone-30-days',
    platform: 'YOUTUBE',
    summary: 'A real-world test comparing budget hardware against flagship $1,200 smartphones for camera, gaming, and battery life.',
    author: 'Tech Unfiltered',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    metrics: { views: '820K', likes: '54K', platform: 'YouTube' },
    trendScore: 97,
    topicTags: ['tech', 'gadgets', 'smartphones', 'budget']
  },
  {
    niche: 'food',
    sourceId: 'fd-001',
    title: '10-Minute Late Night Japanese Ramen (3 Grocery Store Hacks)',
    url: 'https://youtube.com/watch?v=10-min-japanese-ramen-hack',
    platform: 'YOUTUBE',
    summary: 'How to turn basic instant noodles into restaurant-quality creamy tonkotsu broth using milk, egg yolk, and garlic chili oil.',
    author: 'Chef QuickEats',
    thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    metrics: { views: '2.1M', likes: '185K', platform: 'YouTube' },
    trendScore: 98,
    topicTags: ['food', 'recipes', 'quickmeals', 'japanese']
  },
  {
    niche: 'fitness',
    sourceId: 'ft-001',
    title: 'The 15-Minute Morning Dumbbell Routine (Burn Fat & Build Muscle)',
    url: 'https://youtube.com/watch?v=15-min-morning-dumbbell-workout',
    platform: 'YOUTUBE',
    summary: 'No gym membership required. High-intensity full body circuit designed for busy creators and professionals.',
    author: 'IronFit Daily',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    metrics: { views: '950K', likes: '78K', platform: 'YouTube' },
    trendScore: 95,
    topicTags: ['fitness', 'workout', 'homeworkout', 'health']
  },
  {
    niche: 'beauty',
    sourceId: 'bt-001',
    title: 'My 5-Minute Minimal Morning Routine (Dermatologist Approved)',
    url: 'https://youtube.com/watch?v=minimal-dermatologist-morning-routine',
    platform: 'YOUTUBE',
    summary: 'Stripping down a 10-step skincare hype into 3 science-backed active ingredients that actually work.',
    author: 'Glow Lab Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    metrics: { views: '640K', likes: '49K', platform: 'YouTube' },
    trendScore: 94,
    topicTags: ['beauty', 'skincare', 'grwm', 'lifestyle']
  },
  {
    niche: 'travel',
    sourceId: 'tv-001',
    title: 'How I Traveled Across Japan on Just $40 a Day (Full Breakdown)',
    url: 'https://youtube.com/watch?v=japan-budget-solo-travel-guide',
    platform: 'YOUTUBE',
    summary: 'Capsule hotels, 7-Eleven gourmet meals, night buses, and regional train passes that save thousands.',
    author: 'Nomad Chronicles',
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    metrics: { views: '1.2M', likes: '96K', platform: 'YouTube' },
    trendScore: 96,
    topicTags: ['travel', 'japan', 'budgettravel', 'vlog']
  },
  {
    niche: 'finance',
    sourceId: 'fn-001',
    title: 'How I Built a $5,000/Month Digital Product (Step by Step for Beginners)',
    url: 'https://youtube.com/watch?v=digital-product-step-by-step',
    platform: 'YOUTUBE',
    summary: 'Finding high-demand niches, designing Notion templates or presets, and driving organic traffic without ads.',
    author: 'Creator Economy Lab',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    metrics: { views: '480K', likes: '36K', platform: 'YouTube' },
    trendScore: 92,
    topicTags: ['finance', 'sidehustle', 'passiveincome', 'creator']
  }
];

export const fetchYouTubeSources = async (query = '', niche = 'all') => {
  const selectedNiche = NICHE_MAP[niche] || NICHE_MAP.all;
  const searchTerm = query.trim() || selectedNiche.search;

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: searchTerm,
          maxResults: 6,
          type: 'video',
          key: apiKey
        },
        timeout: 3500
      });
      if (res.data.items && res.data.items.length > 0) {
        return res.data.items.map(item => ({
          sourceId: item.id.videoId,
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          platform: 'YOUTUBE',
          summary: item.snippet.description || `Trending video in ${niche} with high engagement.`,
          author: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
          metrics: { views: '50K - 1M+', platform: 'YouTube' },
          trendScore: 95,
          topicTags: [niche, 'youtube', 'viral']
        }));
      }
    }
  } catch (err) {
    console.warn('YouTube live API unavailable, using curated multi-niche trends:', err.message);
  }

  // Filter curated trends by niche or search
  let filtered = MULTI_NICHE_TRENDS;
  if (niche && niche !== 'all') {
    filtered = MULTI_NICHE_TRENDS.filter(t => t.niche === niche);
    if (filtered.length === 0) filtered = MULTI_NICHE_TRENDS;
  }
  if (query && query.trim()) {
    const q = query.toLowerCase();
    const queryMatches = MULTI_NICHE_TRENDS.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.summary.toLowerCase().includes(q) || 
      t.topicTags.some(tag => tag.toLowerCase().includes(q))
    );
    if (queryMatches.length > 0) filtered = queryMatches;
  }

  return filtered;
};

export const fetchRedditSources = async (query = '', niche = 'all') => {
  const selectedNiche = NICHE_MAP[niche] || NICHE_MAP.all;
  const sub = selectedNiche.subreddits;

  try {
    const res = await axios.get(`https://www.reddit.com/r/${sub}/hot.json?limit=6`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CreatorHub/2.0' },
      timeout: 3500
    });
    if (res.data?.data?.children?.length > 0) {
      return res.data.data.children.map(child => ({
        sourceId: `rd-${child.data.id}`,
        title: child.data.title,
        url: `https://reddit.com${child.data.permalink}`,
        platform: 'REDDIT',
        summary: child.data.selftext?.slice(0, 280) || `Active discussion in r/${child.data.subreddit} with ${child.data.num_comments} creator takeaways.`,
        author: `r/${child.data.subreddit} • u/${child.data.author}`,
        thumbnail: child.data.thumbnail && child.data.thumbnail.startsWith('http') ? child.data.thumbnail : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
        metrics: { upvotes: `${child.data.ups} upvotes`, comments: `${child.data.num_comments} comments` },
        trendScore: Math.min(99, Math.floor((child.data.ups || 100) / 20) + 65),
        topicTags: [niche, child.data.subreddit, 'community-pulse']
      }));
    }
  } catch (err) {
    console.warn('Reddit live fetch error, using multi-niche discussions:', err.message);
  }

  return [
    {
      sourceId: 'rd-001',
      title: `r/youtube: "Shorts that tease a long-form video have 4x retention when you link it directly in related video"`,
      url: 'https://reddit.com/r/youtube/comments/shorts_to_longform_multiplier',
      platform: 'REDDIT',
      summary: 'Creators sharing real analytics showing how using YouTube new Related Video button creates a continuous viewer loop.',
      author: 'r/youtube • u/viral_growth_lab',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
      metrics: { upvotes: '840 upvotes', comments: '142 comments' },
      trendScore: 94,
      topicTags: ['youtube', 'growth', 'retention']
    },
    {
      sourceId: 'rd-002',
      title: `r/gaming: "What makes a gaming video essay actually good vs boring gameplay footage with voiceover?"`,
      url: 'https://reddit.com/r/gaming/comments/gaming_video_essay_critique',
      platform: 'REDDIT',
      summary: 'Over 300 gamers breakdown why pacing, music shifts, and answering an emotional question matters more than 4K graphics.',
      author: 'r/gaming • u/storyteller_dan',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
      metrics: { upvotes: '1.2K upvotes', comments: '310 comments' },
      trendScore: 96,
      topicTags: ['gaming', 'storytelling', 'pacing']
    }
  ];
};

export const fetchNewsSources = async (query = '', niche = 'all') => {
  return [
    {
      sourceId: 'nw-001',
      title: 'YouTube Algorithm Update: Watch Time per Impression Now Heavily Favors First 30s Hook Clarity',
      url: 'https://creatorinsider.com/news/algorithm-update-retention-hooks',
      platform: 'NEWS',
      summary: 'Official creator updates reveal that videos with clear visual pattern interrupts in the first 15 seconds receive 2.4x higher browse recommendation.',
      author: 'Creator Insider',
      thumbnail: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=400',
      metrics: { engagement: 'High Industry Impact' },
      trendScore: 98,
      topicTags: ['algorithm', 'youtube', 'hooks']
    },
    {
      sourceId: 'nw-002',
      title: 'Instagram Reels vs TikTok: 2026 Engagement Benchmarks Across 10,000 Channels',
      url: 'https://socialmediatoday.com/reels-vs-tiktok-2026-benchmarks',
      platform: 'NEWS',
      summary: 'Reels currently drives higher conversion for digital products and community, while TikTok drives faster discovery for micro-trends.',
      author: 'Social Media Today',
      thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400',
      metrics: { engagement: 'Trending Benchmark' },
      trendScore: 93,
      topicTags: ['instagram', 'tiktok', 'reels', 'growth']
    }
  ];
};

export const fetchTrendingSources = async (niche = 'all') => {
  return [
    {
      sourceId: 'tr-001',
      title: 'Google Trends: "Silent Reviews" & "Underconsumption Core" Surging +380%',
      url: 'https://trends.google.com/trends/explore?q=silent+review',
      platform: 'TRENDS',
      summary: 'Massive rise in ASMR-style non-verbal reviews where creators tap and express emotion without talking.',
      author: 'Google Trends Radar',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      metrics: { volume: '+380% Breakout' },
      trendScore: 99,
      topicTags: ['trends', 'viral', 'asmr', 'format']
    }
  ];
};

// URL Extraction / Live Importer Helper
export const extractUrlMetadata = async (url) => {
  try {
    let platform = 'WEB';
    let title = 'Imported Web Concept';
    let author = 'Web Creator';
    let thumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600';
    let summary = `Imported from ${url}. Ready to dissect into hooks, blueprints, and derivative content.`;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'YOUTUBE';
      title = 'YouTube Video Teardown: ' + (url.split('v=')[1]?.slice(0, 11) || 'Live Video');
      author = 'YouTube Channel';
      thumbnail = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600';
    } else if (url.includes('instagram.com')) {
      platform = 'INSTAGRAM';
      title = 'Instagram Reel / Post Dissection';
      author = '@creator_instagram';
      thumbnail = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600';
    } else if (url.includes('tiktok.com')) {
      platform = 'TIKTOK';
      title = 'TikTok Viral Trend Analysis';
      author = '@tiktok_creator';
      thumbnail = 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=600';
    } else if (url.includes('reddit.com')) {
      platform = 'REDDIT';
      title = 'Reddit Community Deep Dive';
      author = 'r/community';
      thumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600';
    }

    return {
      success: true,
      data: {
        sourceId: `imp-${Date.now()}`,
        url,
        title,
        platform,
        author,
        thumbnail,
        summary,
        trendScore: 95,
        topicTags: [platform.toLowerCase(), 'imported-source', 'inspiration']
      }
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
