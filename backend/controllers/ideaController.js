import Idea from '../models/Idea.js';
import Activity from '../models/Activity.js';
import { refineIdea } from '../services/aiService.js';

export const getIdeas = async (req, res) => {
  try {
    const { stage, search, priority, tag } = req.query;
    const filter = { archived: false };

    if (stage) filter.stage = stage;
    if (priority) filter.priority = priority;
    if (tag) filter.tags = tag;
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { summary: searchRegex },
      ];
    }

    const ideas = await Idea.find(filter)
      .populate('createdBy', 'name email avatar role')
      .populate('assignedTo', 'name email avatar role')
      .populate('attachedResearchIds')
      .sort({ order: 1, updatedAt: -1 });

    return res.json({ success: true, data: ideas });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createIdea = async (req, res) => {
  try {
    const { title, summary, stage = 'inbox', tags = [], priority = 'medium', targetFormat = 'video', notes = '', sourceRef, audienceFeedbackRef, attachedResearchIds = [] } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    const count = await Idea.countDocuments({ stage });
    const idea = await Idea.create({
      title, summary: summary || '', stage, tags, priority, targetFormat, notes: notes || '',
      sourceRef: sourceRef || null,
      audienceFeedbackRef: audienceFeedbackRef || null,
      attachedResearchIds: attachedResearchIds || [],
      createdBy: req.user._id,
      order: count,
    });

    const populated = await Idea.findById(idea._id)
      .populate('createdBy', 'name email avatar role')
      .populate('attachedResearchIds');

    await Activity.create({
      actorId: req.user._id,
      actionType: 'idea_created',
      entityType: 'idea',
      entityId: idea._id,
      entityTitle: idea.title,
      description: 'Created new idea in stage [' + String(idea.stage).toUpperCase() + '].',
    });

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findByIdAndUpdate(id, req.body, { new: true })
      .populate('createdBy', 'name email avatar role')
      .populate('assignedTo', 'name email avatar role')
      .populate('attachedResearchIds');

    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });
    return res.json({ success: true, data: idea });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStageAndOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, order } = req.body;
    const idea = await Idea.findById(id);
    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });

    const oldStage = idea.stage;
    idea.stage = stage;
    if (order !== undefined) idea.order = order;
    await idea.save();

    if (oldStage !== stage) {
      await Activity.create({
        actorId: req.user._id,
        actionType: 'idea_stage_changed',
        entityType: 'idea',
        entityId: idea._id,
        entityTitle: idea.title,
        description: 'Moved idea from [' + String(oldStage).toUpperCase() + '] to [' + String(stage).toUpperCase() + '].',
      });
    }

    return res.json({ success: true, data: idea });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const refineIdeaWithAI = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });

    const aiRes = await refineIdea({ title: idea.title, summary: idea.summary, stage: idea.stage, tags: idea.tags });
    return res.json({ success: true, data: aiRes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteIdea = async (req, res) => {
  try {
    await Idea.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Idea removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
