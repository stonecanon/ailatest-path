// Prefer production alias so custom domain always hits latest Pages deploy
const PAGES_ORIGIN = 'https://main.ailatest-path.pages.dev';
const ORIGIN_VERSION = '20260717-ai-llms';

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD' }
      });
    }

    const incomingUrl = new URL(request.url);
    const originUrl = new URL(incomingUrl.pathname + incomingUrl.search, PAGES_ORIGIN);
    originUrl.searchParams.set('__origin_version', ORIGIN_VERSION);
    const originRequest = new Request(originUrl, request);
    const response = await fetch(originRequest);
    const headers = new Headers(response.headers);
    // Ensure AI discovery files are served as plain text (not SPA HTML)
    const path = incomingUrl.pathname.toLowerCase();
    if (path.endsWith('.txt') || path.endsWith('.xml') || path === '/robots.txt') {
      if (path.endsWith('.xml') || path === '/sitemap.xml') {
        headers.set('Content-Type', 'application/xml; charset=utf-8');
      } else {
        headers.set('Content-Type', 'text/plain; charset=utf-8');
      }
      headers.set('Cache-Control', 'public, max-age=300');
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
};
