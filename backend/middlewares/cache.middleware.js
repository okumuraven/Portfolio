/**
 * Middleware to set Cache-Control headers for Edge Caching.
 * 
 * This instructs CDNs (like Vercel or Cloudflare) to cache the JSON response
 * at the edge, reducing latency and database load.
 * 
 * @param {number} maxAge - Time in seconds for the shared cache (s-maxage). Default: 1 hour.
 * @param {number} swr - Time in seconds to serve stale data while revalidating (stale-while-revalidate). Default: 24 hours.
 */
const setCacheControl = (maxAge = 3600, swr = 86400) => {
  return (req, res, next) => {
    // Only apply to GET requests to avoid caching mutations or auth
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=${swr}`);
    }
    next();
  };
};

module.exports = { setCacheControl };
