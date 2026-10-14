import ContentBlueprint from '../models/ContentBlueprint.js';
import Content from '../models/Content.js';
import ContentVersion from '../models/ContentVersion.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';
import { improveHook } from '../services/aiService.js';

export const getBlueprints = async (req, res) => {
  try {
    const { status, platform, producerId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (platform) filter.platform = platform;
    if (producerId) filter.assignedProducerId = producerId;

    const blueprints = await ContentBlueprint.find(filter)
      .populate('createdBy', 'name email avatar role')
      .populate('assignedProducerId', 'name email avatar role')
      .populate('attachedResearchIds')
      .populate('ideaId', 'title stage')
      .sort({ updatedAt: -1 });

    return res.json({ success: true, data: blueprints });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlueprintById = async (req, res) => {
  try {
    const blueprint = await ContentBlueprint.findById(req.params.id)
      .populate('createdBy', 'name email avatar role')
      .populate('assignedProducerId', 'name email avatar role')
      .populate('attachedResearchIds')
      .populate('ideaId');

    if (!blueprint) return res.status(404).json({ success: false, message: 'Blueprint not found' });
    return res.json({ success: true, data: blueprint });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createBlueprint = async (req, res) => {
  try {
    const {
      title, hook, targetAudience, platform = 'youtube', contentFormat = 'longform_video', tone = 'Authoritative & Engaging',
      objective, cta, keywords = [], referencesList = [], productionRequirements, attachedResearchIds = [], ideaId, assignedProducerId, status = 'draft',
    } = req.body;

    if (!title || !hook) return res.status(400).json({ success: false, message: 'Title and Hook are required' });

    const blueprint = await ContentBlueprint.create({
      title, hook, targetAudience, platform, contentFormat, tone, objective, cta, keywords, referencesList,
      productionRequirements, attachedResearchIds, ideaId: ideaId || null, assignedProducerId: assignedProducerId || null,
      createdBy: req.user._id, status,
    });

    if (assignedProducerId) {
      await Notification.create({
        recipientId: assignedProducerId,
        senderId: req.user._id,
        type: 'blueprint_received',
        title: 'New Blueprint Assigned',
        message: req.user.name + ' assigned content blueprint: ' + blueprint.title,
        link: '/app/production?blueprintId=' + blueprint._id,
      });
    }

    await Activity.create({
      actorId: req.user._id,
      actionType: 'blueprint_created',
      entityType: 'blueprint',
      entityId: blueprint._id,
      entityTitle: blueprint.title,
      description: 'Created blueprint with [' + blueprint.platform.toUpperCase() + '] target.',
    });

    return res.status(201).json({ success: true, data: blueprint });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const assignToProducer = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedProducerId, productionNotes } = req.body;

    const blueprint = await ContentBlueprint.findById(id);
    if (!blueprint) return res.status(404).json({ success: false, message: 'Blueprint not found' });

    blueprint.assignedProducerId = assignedProducerId;
    blueprint.status = 'sent_to_producer';
    if (productionNotes) blueprint.versionNotes = productionNotes;
    await blueprint.save();

    let content = await Content.findOne({ blueprintId: blueprint._id });
    if (!content) {
      content = await Content.create({
        title: blueprint.title,
        blueprintId: blueprint._id,
        creatorId: blueprint.createdBy,
        producerId: assignedProducerId,
        platform: blueprint.platform,
        format: blueprint.contentFormat.includes('video') ? 'video' : 'article',
        status: 'in_production',
      });

      await ContentVersion.create({
        contentId: content._id,
        versionNumber: 1,
        title: 'Initial Cut (v1)',
        notes: 'Awaiting producer media asset drop',
        mediaUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000',
        mediaType: 'image',
        uploadedBy: req.user._id,
        checklist: [
          { id: 'c1', label: 'Review creative brief and references', completed: true },
          { id: 'c2', label: 'Assemble initial A-roll and audio stem', completed: false },
          { id: 'c3', label: 'Add editorial titles and graphics', completed: false },
          { id: 'c4', label: 'Submit v1 for Creator Review', completed: false },
        ],
      });
    }

    await Notification.create({
      recipientId: assignedProducerId,
      senderId: req.user._id,
      type: 'blueprint_received',
      title: 'Blueprint Dispatched',
      message: req.user.name + ' sent ' + blueprint.title + ' to your production queue.',
      link: '/app/production?contentId=' + content._id,
    });

    await Activity.create({
      actorId: req.user._id,
      actionType: 'blueprint_assigned',
      entityType: 'blueprint',
      entityId: blueprint._id,
      entityTitle: blueprint.title,
      description: 'Dispatched blueprint to producer queue.',
    });

    return res.json({ success: true, data: blueprint, contentId: content._id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const improveHookWithAI = async (req, res) => {
  try {
    const { currentHook, targetAudience, platform, format, tone } = req.body;
    const result = await improveHook({ currentHook, targetAudience, platform, format, tone });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
