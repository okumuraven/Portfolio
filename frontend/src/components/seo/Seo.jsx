import { useEffect } from "react";

const SITE_URL = "https://okumuraven.me";
const DEFAULT_IMAGE = `${SITE_URL}/preview.png`;

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets per-route document.title, description, canonical URL and social
 * meta tags. Runs client-side, but the build-time prerender step captures
 * the resulting DOM per route, so crawlers/AI bots that don't execute JS
 * still see the correct tags baked into the static HTML for that page.
 */
export default function Seo({ title, description, path = "/", image, noindex = false }) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const resolvedImage = image || DEFAULT_IMAGE;

    if (title) document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", resolvedImage);

    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", resolvedImage);
    upsertMeta("name", "twitter:url", url);

    upsertLink("canonical", url);
  }, [title, description, path, image, noindex]);

  return null;
}
