import Comment from '../models/Comment.js';
import Content from '../models/Content.js';
import ContentVersion from '../models/ContentVersion.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';
import { summarizeFeedback } from '../services/aiService.js';

export const getReviewStudioData = async (req, res) => {
  try {
    const { contentId } = req.params;
    const content = await Content.findById(contentId)
      .populate('creatorId', 'name email avatar role')
      .populate('producerId', 'name email avatar role')
      .populate('blueprintId');

    if (!content) return res.status(404).json({ success: false, message: 'Content piece not found' });

    const versions = await ContentVersion.find({ contentId: content._id }).sort({ versionNumber: -1 });
    const currentVersion = versions.find((v) => v.isCurrent) || versions[0];

    const comments = await Comment.find({ contentId: content._id })
      .populate('authorId', 'name email avatar role')
      .populate('resolvedBy', 'name email avatar role')
      .sort({ createdAt: 1 });

    return res.json({
      success: true,
      data: { content, versions, currentVersion, comments },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { contentId, versionId, commentType = 'general', timestampSec, spatialCoord, textSelection, body, mentions = [] } = req.body;
    if (!body) return res.status(400).json({ success: false, message: 'Comment text is required' });

    const comment = await Comment.create({
      contentId,
      versionId,
      authorId: req.user._id,
      commentType,
      timestampSec: timestampSec !== undefined ? timestampSec : null,
      spatialCoord: spatialCoord || null,
      textSelection: textSelection || null,
      body,
      mentions,
    });

    const populated = await Comment.findById(comment._id).populate('authorId', 'name email avatar role');

    const content = await Content.findById(contentId);
    const targetUserId = req.user._id.toString() === content.creatorId.toString() ? content.producerId : content.creatorId;

    if (targetUserId) {
      await Notification.create({
        recipientId: targetUserId,
        senderId: req.user._id,
        type: 'comment',
        title: 'New Review Comment',
        message: req.user.name + ' added a ' + commentType.replace('_', ' ') + ' note on ' + content.title,
        link: '/app/review?contentId=' + content._id + '&versionId=' + versionId,
      });
    }

    await Activity.create({
      actorId: req.user._id,
      actionType: 'comment_added',
      entityType: 'comment',
      entityId: comment._id,
      entityTitle: content.title,
      description: 'Left ' + commentType + ' note: ' + body.slice(0, 40),
    });

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCommentStatus = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { resolved } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    comment.resolved = resolved;
    comment.resolvedBy = resolved ? req.user._id : null;
    comment.resolvedAt = resolved ? new Date() : null;
    await comment.save();

    const populated = await Comment.findById(comment._id)
      .populate('authorId', 'name email avatar role')
      .populate('resolvedBy', 'name email avatar role');

    await Activity.create({
      actorId: req.user._id,
      actionType: 'comment_resolved',
      entityType: 'comment',
      entityId: comment._id,
      entityTitle: 'Review Note',
      description: (resolved ? 'Resolved' : 'Reopened') + ' review comment.',
    });

    return res.json({ success: true, data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const summarizeReviewWithAI = async (req, res) => {
  try {
    const { contentId } = req.params;
    const comments = await Comment.find({ contentId }).populate('authorId', 'name');
    const result = await summarizeFeedback({ comments: comments.map((c) => ({ author: c.authorId?.name, text: c.body, type: c.commentType, timestamp: c.timestampSec })) });

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
