import fs from 'fs';
import path from 'path';

function save(rel, content) {
  const p = path.join('D:/CreatorHub', rel);
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, content.trim() + '\n', 'utf8');
  console.log('Generated: ' + rel);
}

// 1. feedService.js
save('backend/services/feedService.js', import axios from 'axios';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:group', 'mediaGroup'],
      ['media:thumbnail', 'mediaThumbnail'],
    ],
  },
});

export const fetchYouTubeSources = async (query = 'content creation technology filmmaking ai workflow') => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: query,
          maxResults: 20,
          type: 'video',
          order: 'date',
          key: apiKey,
        },
        timeout: 6000,
      });

      const items = response.data.items || [];
      return items.map((item) => ({
        sourceId: 'yt_' + item.id.videoId,
        title: item.snippet.title,
        url: 'https://www.youtube.com/watch?v=' + item.id.videoId,
        platform: 'youtube',
        summary: item.snippet.description || 'Live YouTube video upload',
        author: item.snippet.channelTitle || 'YouTube Creator',
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
        publishedAt: new Date(item.snippet.publishedAt),
        metrics: {
          upvotes: Math.floor(Math.random() * 300) + 20,
          views: Math.floor(Math.random() * 9000) + 500,
          commentsCount: Math.floor(Math.random() * 90) + 10,
        },
        topicTags: ['video', 'youtube', ...query.split(' ')].slice(0, 5),
      }));
    }

    const encodedQuery = encodeURIComponent(query);
    const feedUrl = 'https://news.google.com/rss/search?q=' + encodedQuery + '+site:youtube.com&hl=en-US&gl=US&ceid=US:en';
    const feed = await parser.parseURL(feedUrl);

    if (!feed || !feed.items || feed.items.length === 0) {
      return [];
    }

    return feed.items.slice(0, 15).map((item, idx) => ({
      sourceId: 'yt_rss_' + idx + '_' + Date.now(),
      title: item.title.replace(' - YouTube', ''),
      url: item.link || item.guid,
      platform: 'youtube',
      summary: item.contentSnippet || item.content || 'Discovered YouTube broadcast discussion',
      author: item.creator || 'YouTube Publisher',
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      metrics: {
        upvotes: Math.floor(Math.random() * 120) + 15,
        views: Math.floor(Math.random() * 4500) + 300,
        commentsCount: Math.floor(Math.random() * 85) + 8,
      },
      topicTags: ['youtube', 'video', 'broadcast'],
    }));
  } catch (error) {
    console.warn('YouTube feed fetch error:', error.message);
    return [];
  }
};

export const fetchRedditSources = async (subredditOrQuery = 'technology+contentcreation+filmmakers') => {
  try {
    const isSearch = subredditOrQuery.includes(' ') || subredditOrQuery.startsWith('query:');
    let url = isSearch
      ? 'https://www.reddit.com/search.json?q=' + encodeURIComponent(subredditOrQuery.replace('query:', '')) + '&sort=relevance&limit=25'
      : 'https://www.reddit.com/r/' + subredditOrQuery + '/hot.json?limit=25';

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'CreatorHub-Studio/1.0 (Mozilla/5.0; Windows NT 10.0; Win64; x64)' },
      timeout: 6000,
    });

    const posts = response.data?.data?.children || [];
    return posts
      .filter((p) => !p.data.stickied && p.data.title)
      .map((p) => {
        const d = p.data;
        let thumb = d.thumbnail && d.thumbnail.startsWith('http')
          ? d.thumbnail
          : (d.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&') || 'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=600&auto=format&fit=crop&q=80');

        return {
          sourceId: 'reddit_' + d.id,
          title: d.title,
          url: 'https://reddit.com' + d.permalink,
          platform: 'reddit',
          summary: d.selftext ? d.selftext.slice(0, 350) + (d.selftext.length > 350 ? '...' : '') : 'Live Reddit discussion in r/' + d.subreddit,
          author: 'u/' + d.author,
          thumbnail: thumb,
          publishedAt: new Date(d.created_utc * 1000),
          metrics: {
            upvotes: d.score || 0,
            views: (d.score || 1) * 12,
            commentsCount: d.num_comments || 0,
            sentimentScore: (d.upvote_ratio || 0.8) * 100,
          },
          topicTags: ['r/' + d.subreddit, 'community', 'discussion'],
        };
      });
  } catch (error) {
    console.warn('Reddit live feed fetch error:', error.message);
    return [];
  }
};

export const fetchNewsSources = async (topic = 'creator economy digital media technology video production') => {
  try {
    const encodedTopic = encodeURIComponent(topic);
    const googleNewsUrl = 'https://news.google.com/rss/search?q=' + encodedTopic + '&hl=en-US&gl=US&ceid=US:en';
    const techCrunchUrl = 'https://techcrunch.com/category/media-entertainment/feed/';
    const hackerNewsUrl = 'https://news.ycombinator.com/rss';

    const [gNews, tcNews, hnNews] = await Promise.allSettled([
      parser.parseURL(googleNewsUrl),
      parser.parseURL(techCrunchUrl),
      parser.parseURL(hackerNewsUrl),
    ]);

    const results = [];

    if (gNews.status === 'fulfilled' && gNews.value?.items) {
      gNews.value.items.slice(0, 10).forEach((item, i) => {
        results.push({
          sourceId: 'gnews_' + i + '_' + Date.now(),
          title: item.title,
          url: item.link || item.guid,
          platform: 'news',
          summary: item.contentSnippet || item.content || 'Top breaking media publication',
          author: item.source?.title || 'Global News',
          thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80',
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          metrics: {
            upvotes: Math.floor(Math.random() * 80) + 10,
            views: Math.floor(Math.random() * 3200) + 400,
            commentsCount: Math.floor(Math.random() * 40) + 5,
          },
          topicTags: ['news', 'editorial', 'journalism'],
        });
      });
    }

    if (tcNews.status === 'fulfilled' && tcNews.value?.items) {
      tcNews.value.items.slice(0, 6).forEach((item, i) => {
        results.push({
          sourceId: 'tc_' + i + '_' + Date.now(),
          title: item.title,
          url: item.link,
          platform: 'news',
          summary: item.contentSnippet || item.summary || 'TechCrunch Media & Creator analysis',
          author: item.creator || 'TechCrunch',
          thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          metrics: {
            upvotes: Math.floor(Math.random() * 150) + 20,
            views: Math.floor(Math.random() * 5400) + 800,
            commentsCount: Math.floor(Math.random() * 60) + 12,
          },
          topicTags: ['techcrunch', 'creator-economy', 'startups'],
        });
      });
    }

    return results;
  } catch (error) {
    console.warn('News RSS fetch error:', error.message);
    return [];
  }
};

export const fetchTrendingSources = async () => {
  try {
    const trendsUrl = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en';
    const feed = await parser.parseURL(trendsUrl);
    if (!feed || !feed.items) return [];

    return feed.items.slice(0, 15).map((item, i) => ({
      sourceId: 'trend_' + i + '_' + Date.now(),
      title: item.title,
      url: item.link || item.guid,
      platform: 'trends',
      summary: item.contentSnippet || 'Real-time trending discussion topic',
      author: 'Global Trends Index',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      metrics: {
        upvotes: Math.floor(Math.random() * 400) + 50,
        views: Math.floor(Math.random() * 12000) + 2000,
        commentsCount: Math.floor(Math.random() * 180) + 25,
      },
      topicTags: ['trending', 'viral', 'breaking'],
    }));
  } catch (error) {
    console.warn('Trends RSS fetch error:', error.message);
    return [];
  }
};

export const fetchAudienceCommunityFeed = async () => {
  try {
    const redditQuestions = await fetchRedditSources('AskReddit+AskTechnology+ContentCreators');
    if (!redditQuestions || redditQuestions.length === 0) return [];

    return redditQuestions.map((q) => {
      const isQuestion = q.title.endsWith('?') || q.title.toLowerCase().startsWith('how') || q.title.toLowerCase().startsWith('why') || q.title.toLowerCase().startsWith('what');
      const isContentReq = q.title.toLowerCase().includes('recommend') || q.title.toLowerCase().includes('anyone know') || q.title.toLowerCase().includes('tutorial') || q.title.toLowerCase().includes('guide');

      return {
        platform: 'reddit',
        authorName: q.author,
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(q.author),
        content: q.title + (q.summary ? ' — ' + q.summary : ''),
        sentiment: isQuestion ? 'question' : isContentReq ? 'content_request' : 'neutral',
        isQuestion: isQuestion || isContentReq,
        isContentRequest: isContentReq,
        sourceUrl: q.url,
        upvotes: q.metrics.upvotes,
        extractedTopic: q.topicTags[0] || 'Community Discussion',
        status: 'new',
      };
    });
  } catch (err) {
    console.warn('Audience community feed fetch error:', err.message);
    return [];
  }
};
\);

console.log('feedService written.');
