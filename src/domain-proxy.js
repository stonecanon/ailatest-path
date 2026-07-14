const PAGES_ORIGIN = 'https://ailatest-path.pages.dev';

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
    const originRequest = new Request(originUrl, request);
    const response = await fetch(originRequest);

    return new Response(response.body, response);
  }
};
