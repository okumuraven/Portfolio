const jwt = require('jsonwebtoken');

/**
 * Authentication middleware for Express.
 * 
 * Usage:
 *   router.get("/protected", requireAuth(), handler);                          // Any authenticated user
 *   router.get("/admin", requireAuth(['admin']), handler);                     // Only admin role
 * 
 * @param {string[]} requiredRoles - Optional list of roles; if set, user must have one.
 */
function requireAuth(requiredRoles = []) {
  return function (req, res, next) {
    const authHeader = req.headers['authorization'];
    // Header should be: "Bearer <token>"
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: "Malformed auth header" });
    }

    const token = parts[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devtopsecret');
      req.user = decoded; // e.g. { id, email, role, ... }

      // Optional: Role enforcement
      if (
        requiredRoles.length > 0 &&
        (!decoded.role || !requiredRoles.includes(decoded.role))
      ) {
        return res.status(403).json({ error: "Forbidden: insufficient privileges" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = requireAuth;