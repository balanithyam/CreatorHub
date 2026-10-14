import Content from '../models/Content.js';
import Activity from '../models/Activity.js';
import { findReusableSections, identifyOutdatedInfo } from '../services/aiService.js';

export const getContentFamilyTree = async (req, res) => {
  try {
    const allContents = await Content.find()
      .populate('creatorId', 'name email avatar role')
      .populate('producerId', 'name email avatar role')
      .populate('blueprintId', 'title platform')
      .sort({ createdAt: -1 });

    const tree = [];
    const childMap = new Map();

    allContents.forEach((c) => {
      if (c.parentContentId) {
        const pId = c.parentContentId.toString();
        if (!childMap.has(pId)) childMap.set(pId, []);
        childMap.get(pId).push(c);
      }
    });

    allContents.forEach((c) => {
      if (!c.parentContentId) {
        tree.push({
          ...c.toObject(),
          children: childMap.get(c._id.toString()) || [],
        });
      }
    });

    return res.json({ success: true, data: tree, raw: allContents });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDerivativeContent = async (req, res) => {
  try {
    const { parentContentId, title, platform, format, derivativeType, reuseNotes, reusableSections = [] } = req.body;
    const parent = await Content.findById(parentContentId);
    if (!parent) return res.status(404).json({ success: false, message: 'Parent content piece not found' });

    const derivative = await Content.create({
      title: title || (parent.title + ' [' + derivativeType.toUpperCase() + ']'),
      blueprintId: parent.blueprintId,
      creatorId: req.user._id,
      producerId: parent.producerId,
      platform: platform || 'tiktok',
      format: format || 'short',
      parentContentId: parent._id,
      derivativeType: derivativeType || 'short',
      reuseNotes: reuseNotes || ('Derived from master parent: ' + parent.title),
      reusableSections,
      status: 'in_production',
    });

    await Activity.create({
      actorId: req.user._id,
      actionType: 'content_linked',
      entityType: 'content',
      entityId: derivative._id,
      entityTitle: derivative.title,
      description: 'Spawned derivative ' + derivative.derivativeType + ' from parent ' + parent.title,
    });

    return res.status(201).json({ success: true, data: derivative });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const findReusableSectionsWithAI = async (req, res) => {
  try {
    const { contentId, targetFormat = 'short' } = req.body;
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ success: false, message: 'Content piece not found' });

    const result = await findReusableSections({ contentTitle: content.title, format: content.format, targetFormat });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const auditFreshnessWithAI = async (req, res) => {
  try {
    const { contentId } = req.body;
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ success: false, message: 'Content piece not found' });

    const result = await identifyOutdatedInfo({ contentTitle: content.title, publishedDate: content.createdAt });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
