const requireAdmin = (req, res, next) => {
  try {
    const roles = req.user?.role || req.user?.roles || [];
    if (Array.isArray(roles) ? roles.includes('admin') : roles === 'admin') {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Admin access required', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', data: null });
  }
};

module.exports = requireAdmin;

