export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' does not have access to this creative operation`,
      });
    }
    next();
  };
};

export const isCreator = authorizeRoles('CREATOR');
export const isProducer = authorizeRoles('PRODUCER');
export const isCurator = authorizeRoles('CURATOR');
export const isCreatorOrProducer = authorizeRoles('CREATOR', 'PRODUCER');
export const isCreatorOrCurator = authorizeRoles('CREATOR', 'CURATOR');
