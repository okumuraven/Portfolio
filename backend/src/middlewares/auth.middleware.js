const jwt = require('jsonwebtoken');

// Optionally, set roles allowed for a route:
function requireAuth(requiredRoles = []) {
  return function (req, res, next) {
    const authHeader = req.headers['authorization'];
    // Expects header: "Bearer <token>"
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
      req.user = decoded; // Includes userId, email, role, etc.

      // Optional: Check for required roles (for admin-only routes)
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

// Default middleware: JWT required, any role
// Usage: router.get("/protected", requireAuth(), handler);

module.exports = requireAuth;