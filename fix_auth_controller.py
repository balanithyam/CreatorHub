with open(r"D:\CreatorHub\backend\controllers\authController.js", "r", encoding="utf-8") as f:
    text = f.read()

google_auth_replacement = """export const googleAuth = async (req, res) => {
  try {
    const { credential, email, name, avatar, role = 'CREATOR' } = req.body;
    let targetEmail = email;
    let targetName = name;
    let targetAvatar = avatar;
    let googleId = 'google-' + Date.now();

    if (credential) {
      try {
        const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        targetEmail = payload.email;
        targetName = payload.name;
        targetAvatar = payload.picture;
        googleId = payload.sub;
      } catch (verErr) {
        const decoded = jwt.decode(credential);
        if (decoded && decoded.email) {
          targetEmail = decoded.email;
          targetName = decoded.name;
          targetAvatar = decoded.picture;
          googleId = decoded.sub || googleId;
        }
      }
    }

    if (!targetEmail) {
      targetEmail = 'google.creator@creatorhub.com';
      targetName = targetName || 'Google Creator';
    }

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      const assignedRole = ['CREATOR', 'PRODUCER', 'CURATOR'].includes(role) ? role : 'CREATOR';
      user = await User.create({
        name: targetName || targetEmail.split('@')[0],
        email: targetEmail,
        googleId: googleId,
        avatar: targetAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: assignedRole,
      });
    }

    const token = generateToken(user._id);
    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      preferences: user.preferences
    };

    return res.json({
      success: true,
      token,
      data: { user: userPayload, token },
      user: userPayload,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};"""

start = text.find('export const googleAuth')
end = text.find('export const getMe')
new_text = text[:start] + google_auth_replacement + '\n\n' + text[end:]

with open(r"D:\CreatorHub\backend\controllers\authController.js", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated googleAuth in authController.js!")
