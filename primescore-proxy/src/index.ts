/**
 * PrimeScore CORS Proxy
 *
 * Supports public NTA / Digialm:
 * - HTML
 * - ASPX
 * - PDF
 *
 * Used by PrimeScore on GitHub Pages.
 *
 * URL format:
 * https://YOUR-WORKER.workers.dev/?url=ENCODED_SOURCE_URL
 *
 * IMPORTANT:
 * This proxy does not bypass login/authentication.
 * If an NTA page requires the user's browser session,
 * use PrimeScore's "Paste HTML Source" option instead.
 */

const ALLOWED_EXACT_HOSTS = new Set([
  "examinationservices.nic.in",

  "nta.ac.in",
  "exams.nta.ac.in",

  "ugcnet.nta.ac.in",
  "neet.nta.nic.in",
  "jeemain.nta.nic.in",
  "cuet.nta.nic.in"
]);


function isAllowedHost(hostname) {

  const host = hostname.toLowerCase();

  // Exact NTA domains
  if (ALLOWED_EXACT_HOSTS.has(host)) {
    return true;
  }

  // Digialm frequently uses CDN subdomains such as:
  // cdn3.digialm.com
  // cdn2.digialm.com
  // etc.
  if (
    host === "digialm.com" ||
    host.endsWith(".digialm.com")
  ) {
    return true;
  }

  return false;
}


function corsHeaders(extra = {}) {

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


function json(data, status = 200) {

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


export default {

  async fetch(request) {

    // ---------------------------------------
    // CORS preflight
    // ---------------------------------------

    if (request.method === "OPTIONS") {

      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });

    }


    // ---------------------------------------
    // Only GET
    // ---------------------------------------

    if (request.method !== "GET") {

      return json(
        {
          error:
            "Only GET requests are supported."
        },
        405
      );

    }


    try {

      const requestUrl =
        new URL(request.url);


      // ---------------------------------------
      // Read target URL
      // ---------------------------------------

      const target =
        requestUrl.searchParams.get("url");


      if (!target) {

        return json(
          {
            error:
              "Missing url parameter.",

            usage:
              "?url=https%3A%2F%2Fexample.com%2Fpage.html"
          },
          400
        );

      }


      // ---------------------------------------
      // Validate target URL
      // ---------------------------------------

      let targetUrl;

      try {

        targetUrl =
          new URL(target);

      } catch {

        return json(
          {
            error:
              "Invalid target URL."
          },
          400
        );

      }


      if (
        !["http:", "https:"]
          .includes(targetUrl.protocol)
      ) {

        return json(
          {
            error:
              "Only HTTP/HTTPS target URLs are allowed."
          },
          400
        );

      }


      // ---------------------------------------
      // Security: allowed domains only
      // ---------------------------------------

      if (
        !isAllowedHost(
          targetUrl.hostname
        )
      ) {

        return json(
          {
            error:
              "Target domain is not allowed by this PrimeScore proxy.",

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


      // ---------------------------------------
      // Fetch NTA / Digialm source
      // ---------------------------------------

      const upstream =
        await fetch(
          targetUrl.toString(),
          {

            method: "GET",

            redirect: "follow",

            headers: {

              "Accept":
                "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8",

              "Accept-Language":
                "en-US,en;q=0.9",

              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36"

            }

          }
        );


      // ---------------------------------------
      // Upstream error
      // ---------------------------------------

      if (!upstream.ok) {

        return json(
          {
            error:
              "Upstream examination server returned an error.",

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


      // ---------------------------------------
      // Preserve HTML/PDF content type
      // ---------------------------------------

      const contentType =
        upstream.headers.get(
          "Content-Type"
        ) ||
        "application/octet-stream";


      const headers =
        corsHeaders({

          "Content-Type":
            contentType,

          "X-PrimeScore-Source":
            targetUrl.hostname

        });


      // ---------------------------------------
      // Return source to PrimeScore
      // ---------------------------------------

      return new Response(
        upstream.body,
        {
          status:
            upstream.status,

          headers
        }
      );

    } catch (error) {

      return json(
        {
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
