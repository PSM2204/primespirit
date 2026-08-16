/**
 * PrimeScore CORS Proxy
 *
 * Supports public NTA / Digialm:
 * - HTML
 * - HTM
 * - ASPX
 * - PDF
 *
 * Designed for:
 * - NEET
 * - JEE Main
 * - CUET
 * - UGC NET
 *
 * IMPORTANT:
 * This proxy does NOT bypass authentication, login,
 * cookies, CAPTCHA or protected examination sessions.
 *
 * If an examination page requires a logged-in browser
 * session, use PrimeScore's:
 *   1. Upload HTML
 *   2. Paste HTML Source
 * options instead.
 *
 * URL:
 * https://YOUR-WORKER.workers.dev/?url=ENCODED_SOURCE_URL
 */

// =====================================================
// ALLOWED EXAMINATION DOMAINS
// =====================================================

const ALLOWED_EXACT_HOSTS = new Set<string>([
  "examinationservices.nic.in",

  "nta.ac.in",
  "exams.nta.ac.in",

  "ugcnet.nta.ac.in",
  "neet.nta.nic.in",
  "jeemain.nta.nic.in",
  "cuet.nta.nic.in"
]);


// =====================================================
// CHECK WHETHER TARGET DOMAIN IS ALLOWED
// =====================================================

function isAllowedHost(hostname: string): boolean {

  const host = hostname.toLowerCase().trim();

  // Exact NTA domains
  if (ALLOWED_EXACT_HOSTS.has(host)) {
    return true;
  }

  // Digialm CDN / assessment domains
  //
  // Examples:
  // cdn3.digialm.com
  // cdn2.digialm.com
  // per.g28.digialm.com
  //
  if (
    host === "digialm.com" ||
    host.endsWith(".digialm.com")
  ) {
    return true;
  }

  return false;
}


// =====================================================
// CORS HEADERS
// =====================================================

function corsHeaders(
  extra: Record<string, string> = {}
): Record<string, string> {

  return {

    "Access-Control-Allow-Origin": "*",

    "Access-Control-Allow-Methods":
      "GET, OPTIONS",

    "Access-Control-Allow-Headers":
      "Content-Type",

    "Access-Control-Expose-Headers":
      "Content-Type, X-PrimeScore-Source",

    "Cache-Control":
      "no-store, no-cache, must-revalidate",

    "Pragma":
      "no-cache",

    ...extra
  };
}


// =====================================================
// JSON RESPONSE HELPER
// =====================================================

function json(
  data: unknown,
  status: number = 200
): Response {

  return new Response(
    JSON.stringify(data, null, 2),
    {
      status,

      headers: corsHeaders({
        "Content-Type":
          "application/json; charset=UTF-8"
      })
    }
  );
}


// =====================================================
// MAIN CLOUDFLARE WORKER
// =====================================================

export default {

  async fetch(
    request: Request
  ): Promise<Response> {

    // =================================================
    // CORS PREFLIGHT
    // =================================================

    if (request.method === "OPTIONS") {

      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });

    }


    // =================================================
    // ONLY GET REQUESTS
    // =================================================

    if (request.method !== "GET") {

      return json(
        {
          success: false,

          error:
            "Only GET requests are supported."
        },

        405
      );

    }


    try {

      // ===============================================
      // READ WORKER URL
      // ===============================================

      const requestUrl =
        new URL(request.url);


      const target =
        requestUrl.searchParams.get("url");


      // ===============================================
      // URL IS REQUIRED
      // ===============================================

      if (!target) {

        return json(
          {
            success: false,

            error:
              "Missing url parameter.",

            usage:
              "?url=https%3A%2F%2Fexample.com%2Fpage.html"
          },

          400
        );

      }


      // ===============================================
      // PARSE TARGET URL
      // ===============================================

      let targetUrl: URL;

      try {

        targetUrl =
          new URL(target);

      } catch {

        return json(
          {
            success: false,

            error:
              "Invalid target URL."
          },

          400
        );

      }


      // ===============================================
      // ONLY HTTP / HTTPS
      // ===============================================

      if (
        targetUrl.protocol !== "http:" &&
        targetUrl.protocol !== "https:"
      ) {

        return json(
          {
            success: false,

            error:
              "Only HTTP and HTTPS URLs are allowed."
          },

          400
        );

      }


      // ===============================================
      // DOMAIN SECURITY
      // ===============================================

      if (
        !isAllowedHost(
          targetUrl.hostname
        )
      ) {

        return json(
          {
            success: false,

            error:
              "Target domain is not allowed by PrimeScore.",

            target:
              targetUrl.hostname,

            allowedDomains: [

              "examinationservices.nic.in",

              "nta.ac.in",

              "exams.nta.ac.in",

              "ugcnet.nta.ac.in",

              "neet.nta.nic.in",

              "jeemain.nta.nic.in",

              "cuet.nta.nic.in",

              "*.digialm.com"

            ]
          },

          403
        );

      }


      // ===============================================
      // FETCH EXAMINATION PAGE
      // ===============================================

      const upstream =
        await fetch(
          targetUrl.toString(),
          {

            method: "GET",

            redirect: "follow",

            headers: {

              "Accept":
                "text/html,application/xhtml+xml,application/xml,application/pdf;q=0.9,*/*;q=0.8",

              "Accept-Language":
                "en-US,en;q=0.9",

              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36"

            }

          }
        );


      // ===============================================
      // UPSTREAM FAILED
      // ===============================================

      if (!upstream.ok) {

        return json(
          {
            success: false,

            error:
              "The examination server returned an error.",

            status:
              upstream.status,

            statusText:
              upstream.statusText,

            source:
              targetUrl.hostname
          },

          upstream.status
        );

      }


      // ===============================================
      // DETERMINE CONTENT TYPE
      // ===============================================

      const contentType =
        upstream.headers.get(
          "Content-Type"
        ) ||
        "application/octet-stream";


      // ===============================================
      // RETURN SOURCE
      // ===============================================

      return new Response(
        upstream.body,

        {
          status:
            upstream.status,

          headers:
            corsHeaders({

              "Content-Type":
                contentType,

              "X-PrimeScore-Source":
                targetUrl.hostname

            })

        }
      );


    } catch (error) {

      // ===============================================
      // UNEXPECTED ERROR
      // ===============================================

      return json(
        {
          success: false,

          error:
            "PrimeScore proxy error.",

          message:
            error instanceof Error
              ? error.message
              : String(error)
        },

        500
      );

    }

  }

};
