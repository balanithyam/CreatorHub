import Content from '../models/Content.js';
import ContentVersion from '../models/ContentVersion.js';
import Asset from '../models/Asset.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

export const getProductionWorkspaces = async (req, res) => {
  try {
    const contents = await Content.find()
      .populate('blueprintId')
      .populate('creatorId', 'name email avatar role')
      .populate('producerId', 'name email avatar role')
      .sort({ updatedAt: -1 });

    return res.json({ success: true, data: contents });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getContentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id)
      .populate('blueprintId')
      .populate('creatorId', 'name email avatar role')
      .populate('producerId', 'name email avatar role')
      .populate('parentContentId', 'title platform format');

    if (!content) return res.status(404).json({ success: false, message: 'Content piece not found' });

    const versions = await ContentVersion.find({ contentId: content._id })
      .populate('uploadedBy', 'name email avatar role')
      .sort({ versionNumber: -1 });

    const assets = await Asset.find({ contentId: content._id })
      .populate('uploadedBy', 'name email avatar role')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: { content, versions, assets, currentVersion: versions.find((v) => v.isCurrent) || versions[0] },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateChecklist = async (req, res) => {
  try {
    const { versionId } = req.params;
    const { checklist } = req.body;

    const version = await ContentVersion.findById(versionId);
    if (!version) return res.status(404).json({ success: false, message: 'Version not found' });

    version.checklist = checklist;
    await version.save();

    return res.json({ success: true, data: version });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadAsset = async (req, res) => {
  try {
    const { contentId, name, tags = [] } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'No media file provided' });

    let mediaUrl = '/uploads/' + req.file.filename;
    let publicId = '';

    if (isCloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto', folder: 'creatorhub/assets' });
      mediaUrl = result.secure_url;
      publicId = result.public_id;
    }

    const mime = req.file.mimetype;
    let fileType = 'document';
    if (mime.startsWith('video/')) fileType = 'video';
    else if (mime.startsWith('image/')) fileType = 'image';
    else if (mime.startsWith('audio/')) fileType = 'audio';

    const asset = await Asset.create({
      name: name || req.file.originalname,
      originalName: req.file.originalname,
      fileType,
      mimeType: mime,
      size: req.file.size,
      url: mediaUrl,
      publicId,
      tags: typeof tags === 'string' ? tags.split(',') : tags,
      uploadedBy: req.user._id,
      contentId: contentId || null,
    });

    await Activity.create({
      actorId: req.user._id,
      actionType: 'asset_uploaded',
      entityType: 'asset',
      entityId: asset._id,
      entityTitle: asset.name,
      description: 'Uploaded new ' + asset.fileType + ' asset [' + (asset.size / (1024 * 1024)).toFixed(1) + ' MB].',
    });

    return res.status(201).json({ success: true, data: asset });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadNewVersion = async (req, res) => {
  try {
    const { contentId, title, notes, checklist = [] } = req.body;
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ success: false, message: 'Content piece not found' });

    let mediaUrl = req.body.mediaUrl || '';
    let publicId = '';
    let mediaType = req.body.mediaType || 'video';

    if (req.file) {
      mediaUrl = '/uploads/' + req.file.filename;
      const mime = req.file.mimetype;
      if (mime.startsWith('video/')) mediaType = 'video';
      else if (mime.startsWith('image/')) mediaType = 'image';
      else if (mime.startsWith('audio/')) mediaType = 'audio';

      if (isCloudinaryConfigured) {
        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto', folder: 'creatorhub/versions' });
        mediaUrl = result.secure_url;
        publicId = result.public_id;
      }
    }

    if (!mediaUrl) {
      mediaUrl = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200';
      mediaType = 'image';
    }

    await ContentVersion.updateMany({ contentId: content._id }, { isCurrent: false });

    const highestVersion = await ContentVersion.findOne({ contentId: content._id }).sort({ versionNumber: -1 });
    const newVersionNumber = highestVersion ? highestVersion.versionNumber + 1 : 1;

    const version = await ContentVersion.create({
      contentId: content._id,
      versionNumber: newVersionNumber,
      title: title || ('Version ' + newVersionNumber),
      notes: notes || ('Cut v' + newVersionNumber + ' prepared for review'),
      mediaUrl,
      mediaType,
      mediaPublicId: publicId,
      fileSize: req.file ? req.file.size : 0,
      uploadedBy: req.user._id,
      checklist: Array.isArray(checklist) && checklist.length > 0 ? checklist : [
        { id: 'v1', label: 'Color grading normalized', completed: true },
        { id: 'v2', label: 'Audio loudness conform to -14 LUFS', completed: true },
        { id: 'v3', label: 'Title safe zones verified', completed: false },
      ],
      isCurrent: true,
    });

    content.currentVersionNumber = newVersionNumber;
    content.status = 'in_review';
    await content.save();

    await Notification.create({
      recipientId: content.creatorId,
      senderId: req.user._id,
      type: 'new_version',
      title: 'Version ' + newVersionNumber + ' Ready for Review',
      message: req.user.name + ' submitted Version ' + newVersionNumber + ' of ' + content.title,
      link: '/app/review?contentId=' + content._id + '&versionId=' + version._id,
    });

    await Activity.create({
      actorId: req.user._id,
      actionType: 'version_created',
      entityType: 'version',
      entityId: version._id,
      entityTitle: content.title + ' (v' + version.versionNumber + ')',
      description: 'Published Version ' + version.versionNumber + ' for creator review.',
    });

    return res.status(201).json({ success: true, data: version });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreVersion = async (req, res) => {
  try {
    const { versionId } = req.params;
    const version = await ContentVersion.findById(versionId);
    if (!version) return res.status(404).json({ success: false, message: 'Version not found' });

    await ContentVersion.updateMany({ contentId: version.contentId }, { isCurrent: false });
    version.isCurrent = true;
    await version.save();

    const content = await Content.findById(version.contentId);
    content.currentVersionNumber = version.versionNumber;
    await content.save();

    return res.json({ success: true, message: 'Restored Version ' + version.versionNumber + ' as active cut', data: version });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
