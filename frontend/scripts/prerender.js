/**
 * Build-time prerendering.
 *
 * This app is a pure client-side React SPA — the shipped HTML is just an
 * empty <div id="root">. Google can render JS (slowly), but Bing and most
 * AI/answer-engine crawlers either don't or do so unreliably, so they see
 * close to nothing. This script runs after `react-scripts build`, loads
 * each public route in a real (headless) browser against the built bundle,
 * waits for data fetching to settle, and writes the fully-rendered HTML
 * back into the build output as a static snapshot for that route.
 *
 * Real visitors still get the normal client-rendered app — React mounts
 * over the snapshot on load, same as any other visit. This only changes
 * what a crawler that does NOT execute JS will see on first fetch.
 *
 * This step is a progressive enhancement, never a build requirement: any
 * failure here is caught and logged, and the script always exits 0 so it
 * can never fail the Vercel build. If it fails, the site simply falls back
 * to the plain CSR build that already works today.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

const BUILD_DIR = path.join(__dirname, "..", "build");

// Public, non-authenticated routes only — /admin/* and /auth/login are
// intentionally excluded (client-auth-gated, and noindex'd respectively).
const ROUTES = ["/", "/projects", "/skill-matrix", "/timeline", "/contact"];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function startStaticServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    let filePath = path.join(BUILD_DIR, urlPath);

    // Directory or extensionless path -> SPA fallback to index.html
    if (!path.extname(filePath) || (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory())) {
      filePath = path.join(BUILD_DIR, "index.html");
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        // Unknown asset -> SPA fallback too, matches how Vercel serves this app
        fs.readFile(path.join(BUILD_DIR, "index.html"), (err2, fallback) => {
          if (err2) {
            res.writeHead(404);
            res.end("Not found");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(fallback);
        });
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
      res.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function outputPathFor(route) {
  if (route === "/") return path.join(BUILD_DIR, "index.html");
  return path.join(BUILD_DIR, route, "index.html");
}

async function run() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.warn("[prerender] build/ not found, skipping.");
    return;
  }

  let puppeteer;
  try {
    puppeteer = require("puppeteer");
  } catch {
    console.warn("[prerender] puppeteer not installed, skipping.");
    return;
  }

  const server = await startStaticServer();
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        // The prerender server runs on localhost, not the real production
        // domain, so the app's cross-origin API calls would otherwise be
        // blocked by the backend's CORS whitelist. This headless instance
        // only ever scrapes our own app's rendered output at build time —
        // it's not exposed to any user or untrusted content.
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });

    for (const route of ROUTES) {
      try {
        const page = await browser.newPage();
        await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });

        // PublicLayout always shows a ~3.2s scripted "boot sequence" overlay
        // (TerminalLoader) before the real app mounts, on every fresh load.
        // Wait for it to clear before anything else, or we just capture the
        // animation mid-flight instead of the real page.
        await page
          .waitForSelector('[class*="TerminalLoader_overlay"]', { hidden: true, timeout: 15000 })
          .catch(() => {});

        // Only once the real components mount do the react-query data
        // fetches actually fire — wait for those to settle too. Generous
        // timeout: the backend is a free-tier Render service and may need
        // to cold-start.
        await page.waitForNetworkIdle({ idleTime: 500, timeout: 45000 }).catch(() => {});

        // Let any post-fetch layout effects (CaseBoard pin measurements) settle.
        await new Promise((r) => setTimeout(r, 500));
        const html = await page.content();
        await page.close();

        const outPath = outputPathFor(route);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html);
        console.log(`[prerender] wrote ${path.relative(BUILD_DIR, outPath)}`);
      } catch (routeErr) {
        console.warn(`[prerender] failed for ${route}, leaving CSR build for this route:`, routeErr.message);
      }
    }
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

run()
  .then(() => console.log("[prerender] done."))
  .catch((err) => {
    console.warn("[prerender] skipped due to error (build output is unaffected):", err.message);
  });
