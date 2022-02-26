/********* Start Worker Customisation *********/

// Replace 'crisp-react.winwiz1.com' with the custom
// domain or subdomain used for full stack deployment.
const siteMap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://crisp-react.winwiz1.com</loc>
  </url>
  <url>
    <loc>https://crisp-react.winwiz1.com/a</loc>
  </url>
  <url>
    <loc>https://crisp-react.winwiz1.com/namelookup</loc>
  </url>
  <url>
    <loc>https://crisp-react.winwiz1.com/lighthouse</loc>
  </url>
  <url>
    <loc>https://crisp-react.winwiz1.com/second</loc>
  </url>
</urlset>
`;

// List landing (e.g. index) pages
// of your SPAs here along with the
// root path "/".
const spaPaths = [
  "/",
  "/first",
  "/second",
];

/********* End Worker Customisation *********/

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

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

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

  if (path === "/sitemap.xml") {
    return new Response(
      siteMap,
      {
        headers: {"content-type": "text/xml;charset=UTF-8"},
      }
    );
  }

  if ((extension === ".html" || extensionLess === true) &&
    (bots.some(bot => userAgent.indexOf(bot) !== -1) ||
    !spaPaths.includes(path))) {
    const res = await fetch(req);
    return rewriter.transform(res);
  } else {
   return fetch(req);
  }
}
