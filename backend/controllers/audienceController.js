import AudienceFeedback from '../models/AudienceFeedback.js';
import Idea from '../models/Idea.js';
import Activity from '../models/Activity.js';
import { analyzeFeedbackClustering } from '../services/aiService.js';

export const getAudienceFeed = async (req, res) => {
  try {
    const { platform, sentiment, converted, search } = req.query;
    const filter = {};

    if (platform) filter.platform = platform;
    if (sentiment) filter.sentiment = sentiment;
    if (converted !== undefined) filter.convertedToIdea = converted === 'true';
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { content: searchRegex },
        { authorName: searchRegex },
      ];
    }

    const feedback = await AudienceFeedback.find(filter)
      .populate('convertedIdeaId')
      .sort({ upvotes: -1, createdAt: -1 });

    return res.json({ success: true, data: feedback, count: feedback.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAudienceFeedback = getAudienceFeed;

export const createAudienceFeedback = async (req, res) => {
  try {
    const { platform = 'manual_submission', authorName, authorAvatar, content, sentiment = 'question', sourceUrl, upvotes = 1 } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

    const item = await AudienceFeedback.create({
      platform,
      authorName: authorName || 'Anonymous Viewer',
      authorAvatar: authorAvatar || '',
      content,
      sentiment,
      sourceUrl: sourceUrl || '',
      upvotes,
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const convertFeedbackToIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetFormat = 'video', priority = 'high', customTitle } = req.body;

    const feedback = await AudienceFeedback.findById(id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Audience item not found' });

    const ideaTitle = customTitle || ('Viewer Request: ' + feedback.content.slice(0, 60) + '...');
    const idea = await Idea.create({
      title: ideaTitle,
      summary: 'Inspired by audience feedback from ' + feedback.authorName + ': "' + feedback.content + '"',
      stage: 'inbox',
      priority,
      targetFormat,
      tags: ['audience-request', feedback.platform],
      audienceFeedbackRef: feedback._id,
      createdBy: req.user._id,
    });

    feedback.convertedToIdea = true;
    feedback.convertedIdeaId = idea._id;
    await feedback.save();

    await Activity.create({
      actorId: req.user._id,
      actionType: 'feedback_converted',
      entityType: 'audience',
      entityId: feedback._id,
      entityTitle: ideaTitle,
      description: 'Converted viewer question from [' + feedback.authorName + '] to Content Idea.',
    });

    return res.json({ success: true, data: { feedback, idea } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await AudienceFeedback.findByIdAndUpdate(id, req.body, { new: true });
    if (!feedback) return res.status(404).json({ success: false, message: 'Audience item not found' });
    return res.json({ success: true, data: feedback });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const summarizeAudienceWithAI = async (req, res) => {
  try {
    const feedbackList = await AudienceFeedback.find({ convertedToIdea: false }).limit(25);
    const result = await analyzeFeedbackClustering(feedbackList.map((f) => f.content));
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clusterFeedbackWithAI = summarizeAudienceWithAI;
