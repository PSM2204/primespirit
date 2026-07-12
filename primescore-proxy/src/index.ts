// PrimeScore PDF Proxy — Cloudflare Worker
const ALLOWED_ORIGIN = '*';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    const reqUrl = new URL(request.url);
    const target = reqUrl.searchParams.get('url');

    if (!target) {
      return new Response('Missing "url" query parameter, e.g. ?url=https://example.com/response.pdf', {
        status: 400,
        headers: corsHeaders(),
      });
    }

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch {
      return new Response('Invalid URL', { status: 400, headers: corsHeaders() });
    }
    if (targetUrl.protocol !== 'https:' && targetUrl.protocol !== 'http:') {
      return new Response('Only http/https URLs are allowed', { status: 400, headers: corsHeaders() });
    }

    try {
      const upstream = await fetch(targetUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PrimeScoreProxy/1.0)',
          'Accept': 'application/pdf,*/*',
        },
        redirect: 'follow',
      });

      if (!upstream.ok) {
        return new Response('Upstream server returned ' + upstream.status, {
          status: 502,
          headers: corsHeaders(),
        });
      }

      const buf = await upstream.arrayBuffer();
      return new Response(buf, {
        status: 200,
        headers: {
          ...corsHeaders(),
          'Content-Type': upstream.headers.get('Content-Type') || 'application/pdf',
          'Cache-Control': 'no-store',
        },
      });
    } catch (err) {
      return new Response('Fetch failed: ' + err.message, { status: 502, headers: corsHeaders() });
    }
  },
};