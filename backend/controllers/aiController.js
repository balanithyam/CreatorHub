import {
  explainTopic,
  summarizeResearch,
  refineIdea,
  improveHook,
  generateTitlesAndThumbnails,
  generateShortScript,
  summarizeFeedback,
  findReusableSections,
  identifyOutdatedInfo,
  generateGenericAiAction,
} from '../services/aiService.js';

export const handleExplainTopic = async (req, res) => {
  try {
    const result = await explainTopic(req.body);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const handleSummarizeResearch = async (req, res) => {
  try {
    const result = await summarizeResearch(req.body);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const handleRefineIdea = async (req, res) => {
  try {
    const result = await refineIdea(req.body);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const handleImproveHook = async (req, res) => {
  try {
    const result = await improveHook(req.body);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const handleTitlesAndThumbnails = async (req, res) => {
  try {
    const result = await generateTitlesAndThumbnails(req.body);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const handleShortScript = async (req, res) => {
  try {
    const result = await generateShortScript(req.body);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const handleSummarizeFeedback = async (req, res) => {
  try {
    const result = await summarizeFeedback(req.body);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const handleFindReusable = async (req, res) => {
  try {
    const result = await findReusableSections(req.body);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const handleAuditFreshness = async (req, res) => {
  try {
    const result = await identifyOutdatedInfo(req.body);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const handleAiGenerate = async (req, res) => {
  try {
    const result = await generateGenericAiAction(req.body);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
