import Idea from '../models/Idea.js';
import Research from '../models/Research.js';
import ContentBlueprint from '../models/ContentBlueprint.js';
import Content from '../models/Content.js';
import Asset from '../models/Asset.js';
import ExternalSource from '../models/ExternalSource.js';

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, results: [], data: { ideas: [], research: [], blueprints: [], content: [], assets: [], sources: [], results: [] } });
    }

    const searchRegex = new RegExp(q.trim(), 'i');

    const [ideas, research, blueprints, content, assets, sources] = await Promise.all([
      Idea.find({ $or: [{ title: searchRegex }, { summary: searchRegex }] }).limit(5),
      Research.find({ $or: [{ title: searchRegex }, { summary: searchRegex }, { notes: searchRegex }] }).limit(5),
      ContentBlueprint.find({ $or: [{ title: searchRegex }, { hook: searchRegex }] }).limit(5),
      Content.find({ title: searchRegex }).limit(5),
      Asset.find({ name: searchRegex }).limit(5),
      ExternalSource.find({ $or: [{ title: searchRegex }, { summary: searchRegex }] }).limit(5),
    ]);

    const formatted = [
      ...ideas.map((i) => ({ type: 'idea', id: i._id, title: i.title, subtitle: `Idea [${i.stage || 'STAGE'}]`, link: '/app/ideas' })),
      ...research.map((r) => ({ type: 'research', id: r._id, title: r.title, subtitle: `Research [${r.sourceType || 'NOTE'}]`, link: '/app/research' })),
      ...blueprints.map((b) => ({ type: 'blueprint', id: b._id, title: b.title, subtitle: `Blueprint [${b.platform || b.targetFormat || 'FORMAT'}]`, link: '/app/blueprints' })),
      ...content.map((c) => ({ type: 'content', id: c._id, title: c.title, subtitle: `Content [${c.status || 'STATUS'}]`, link: `/app/production?contentId=${c._id}` })),
      ...assets.map((a) => ({ type: 'asset', id: a._id, title: a.name, subtitle: `Asset [${a.fileType || 'MEDIA'}]`, link: '/app/production' })),
      ...sources.map((s) => ({ type: 'source', id: s._id, title: s.title, subtitle: `Live Source [${s.platform || 'WEB'}]`, link: '/app/discover' })),
    ];

    return res.json({
      success: true,
      count: formatted.length,
      results: formatted,
      data: {
        ideas,
        research,
        blueprints,
        content,
        assets,
        sources,
        results: formatted
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
