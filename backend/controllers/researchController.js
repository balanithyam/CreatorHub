import Research from '../models/Research.js';
import Idea from '../models/Idea.js';
import Activity from '../models/Activity.js';
import { synthesizeResearch } from '../services/aiService.js';

export const getResearchList = async (req, res) => {
  try {
    const { search, sourceType, tag } = req.query;
    const filter = {};

    if (sourceType) filter.sourceType = sourceType;
    if (tag) filter.tags = tag;
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { summary: searchRegex },
        { notes: searchRegex },
      ];
    }

    const items = await Research.find(filter)
      .populate('createdBy', 'name email avatar role')
      .populate('attachedToIdeaIds')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getResearch = getResearchList;

export const createResearch = async (req, res) => {
  try {
    const { title, url, sourceName, sourceType = 'article', summary, keyPoints = [], discussionInsights = [], notes, tags = [] } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    const item = await Research.create({
      title,
      url: url || '',
      sourceName: sourceName || 'Web Source',
      sourceType,
      summary: summary || '',
      keyPoints: keyPoints || [],
      discussionInsights: discussionInsights || [],
      notes: notes || '',
      tags: tags || [],
      createdBy: req.user._id,
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const summarizeResearchWithAI = async (req, res) => {
  try {
    const { id } = req.params;
    const research = await Research.findById(id);
    if (!research) return res.status(404).json({ success: false, message: 'Research item not found' });

    const synthesized = await synthesizeResearch({
      title: research.title,
      summary: research.summary,
      keyPoints: research.keyPoints,
      notes: research.notes,
    });

    research.talkingPoints = synthesized.talkingPoints || [];
    research.audienceQuotes = synthesized.audienceQuotes || [];
    research.counterarguments = synthesized.counterarguments || [];
    await research.save();

    return res.json({ success: true, data: research });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const synthesizeWithAI = summarizeResearchWithAI;

export const deleteResearch = async (req, res) => {
  try {
    await Research.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Research removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
