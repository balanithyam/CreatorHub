import ExternalSource from '../models/ExternalSource.js';
import Activity from '../models/Activity.js';
import {
  fetchYouTubeSources,
  fetchRedditSources,
  fetchNewsSources,
  fetchTrendingSources,
  extractUrlMetadata,
} from '../services/feedService.js';

export const getDiscoverFeed = async (req, res) => {
  try {
    const { platform = 'all', query = '', niche = 'all' } = req.query;
    let sources = [];

    if (platform === 'youtube') {
      sources = await fetchYouTubeSources(query, niche);
    } else if (platform === 'reddit') {
      sources = await fetchRedditSources(query, niche);
    } else if (platform === 'news') {
      sources = await fetchNewsSources(query, niche);
    } else if (platform === 'trends') {
      sources = await fetchTrendingSources(niche);
    } else {
      const [yt, rd, nw, tr] = await Promise.allSettled([
        fetchYouTubeSources(query, niche),
        fetchRedditSources(query, niche),
        fetchNewsSources(query, niche),
        fetchTrendingSources(niche),
      ]);

      if (yt.status === 'fulfilled') sources.push(...yt.value);
      if (rd.status === 'fulfilled') sources.push(...rd.value);
      if (nw.status === 'fulfilled') sources.push(...nw.value);
      if (tr.status === 'fulfilled') sources.push(...tr.value);
    }

    const savedSources = await ExternalSource.find({ savedBy: req.user._id, isSaved: true });
    const savedIds = new Set(savedSources.map((s) => s.sourceId));

    const enriched = sources.map((s) => ({
      ...s,
      isSaved: savedIds.has(s.sourceId),
    }));

    return res.json({ success: true, data: enriched, count: enriched.length, niche });
  } catch (error) {
    return res.status(500).json({ success: false, unavailable: true, message: error.message });
  }
};

export const importSourceUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required for import' });
    }

    const result = await extractUrlMetadata(url);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.json({ success: true, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const saveSource = async (req, res) => {
  try {
    const { sourceId, title, url, platform, summary, author, thumbnail, metrics, topicTags } = req.body;
    let source = await ExternalSource.findOne({ sourceId });
    if (!source) {
      source = new ExternalSource({ sourceId, title, url, platform: platform || 'other', summary, author, thumbnail, metrics, topicTags });
    }

    if (!source.savedBy.includes(req.user._id)) source.savedBy.push(req.user._id);
    source.isSaved = true;
    await source.save();

    await Activity.create({
      actorId: req.user._id,
      actionType: 'source_saved',
      entityType: 'source',
      entityId: source._id,
      entityTitle: source.title,
      description: 'Saved live ' + source.platform + ' reference to library.',
    });

    return res.json({ success: true, message: 'Source saved', source });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSavedSources = async (req, res) => {
  try {
    const sources = await ExternalSource.find({ savedBy: req.user._id, isSaved: true }).sort({ updatedAt: -1 });
    return res.json({ success: true, data: sources });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
