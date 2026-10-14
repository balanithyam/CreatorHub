import Activity from '../models/Activity.js';

export const getWorkspaceActivity = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('actorId', 'name email avatar role')
      .sort({ createdAt: -1 })
      .limit(30);

    return res.json({ success: true, data: activities });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
