/********* Start Worker Customisation *********/

// Replace 'jamstack.winwiz1.com' with the custom
// domain or subdomain used for Jamstack deployment.
const siteMap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jamstack.winwiz1.com</loc>
  </url>
  <url>
    <loc>https://jamstack.winwiz1.com/a</loc>
  </url>
  <url>
    <loc>https://jamstack.winwiz1.com/namelookup</loc>
  </url>
  <url>
    <loc>https://jamstack.winwiz1.com/lighthouse</loc>
  </url>
  <url>
    <loc>https://jamstack.winwiz1.com/second</loc>
  </url>
</urlset>
`;

// Replace 'crisp-react.pages.dev' with the subdomain
// created by Cloudflare Pages. This subdomain is
// referred to as 'per-project subdomain' in README.
const pagesDomain = "https://crisp-react.pages.dev";

// Adjust to ensure that for each SPA, its landing
// (e.g. index) page and the internal pages are listed.
const redirects = {
  // Request for the root page has to be redirected
  // to the SPA that has 'redirect' flag set to 'true'
  "/":              "/first",

  // The internal "/a" page belongs
  // to the SPA named 'first'
  "/a":            "/first",

  // The internal "/namelookup" page belongs
  // to the SPA called 'first'
  "/namelookup":   "/first",

  // The internal "/lighthouse" page belongs
  // to the SPA called 'first'
  "/lighthouse":   "/first",

  // The landing page "/first" belongs
  // to the SPA called 'first'.
  "/first":        "/first",

  // The landing page "/second" belongs
  // to the SPA called 'second'.
  "/second":        "/second",

  // There are no internal pages that belong
  // to the SPA called "second". Otherwise those
  // pages would have been listed here.
};

/********* End Worker Customisation *********/

const spaPaths = ["/"];

for (const [key, value] of Object.entries(redirects)) {
  if (key === value) {
    spaPaths.push(key);
  }
};

const robotsTxt = `User-agent: *
Allow: /
`;

const bots = [
  "googlebot",
  "bingbot",
  "yahoo",
  "applebot",
  "yandex",
  "baidu",
];

class ElementHandler {
  element(element) {
    element?.replace('<div id="app-root"></div>', {html: true});
  }

  comments(comment) {
  }

  text(text) {
  }
}

const rewriter = new HTMLRewriter().on(
  "div[id='app-root']",
  new ElementHandler()
);

function getRedirectPath(path) {
  if (path in redirects) {
    return redirects[path];
  }
  return path;
}

addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(req) {
  const parsedUrl = new URL(req.url);
  const path = parsedUrl.pathname.toLowerCase();
  const lastIdx = path.lastIndexOf(".");
  const extensionLess = lastIdx === -1;
  const extension = path.substring(lastIdx);
  const userAgent = (req.headers.get("User-Agent") || "")?.toLowerCase() ?? "";
  const urlToFetch = pagesDomain + getRedirectPath(path);

  if (path === "/sitemap.xml") {
    return new Response(
      siteMap,
      {
        headers: {"content-type": "text/xml;charset=UTF-8"},
      }
    );
  }

  if (path === "/robots.txt") {
    return new Response(
      robotsTxt,
      {
        headers: {"content-type": "text/plain;charset=UTF-8"},
      }
    );
  }

  if ((extension === ".html" || extensionLess === true) &&
    (bots.some(bot => userAgent.indexOf(bot) !== -1) ||
    !spaPaths.includes(path))) {
    const res = await fetch(urlToFetch, req);
    return rewriter.transform(res);
  } else {
    return fetch(urlToFetch, req);
  }
}
