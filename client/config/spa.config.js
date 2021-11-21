/*
Crisp React supports splitting React application into several SPAs.

Each SPA has:
- name (e.g. 'first' or 'login' or 'reporting' etc.). Used to define the 
  SPA landing page (e.g. /first.html or /login.html) and name the bundle 
  that renders the SPA: first<hash>.js
- entryPoint component (or to be precise a .tsx file with the code that
  renders the landing page of the SPA). Webpack calls it entry point.
- redirect flag. If set to true, makes webserver redirect to the landing page
  of this SPA when serving requests with unknown request path. It's the standard
  fallback behavior required by all SPAs and implemented in webpack-dev-server
  using the 'historyApiFallback' setting. One and only one SPA must have this
  flag set to avoid redirection ambiguity.
- SSR flag. Controls build-time SSR also called prerendering or static
  generation. If set to true, the SPA landing page will be prerendered at the
  build time e.g. its HTML will be generated and inserted into the <body> of
  the .html file.
  Any SPA can have this flag set. When the flag is not set, the <body>
  contains mainly references to the script bundles with very little HTML markup.

You can customize SPAs by modifying the SPA Configuration block below. It will
reconfigure client, backend and the tests.

Note: Page transitions within an SPA are performed as usual using <Link>,
  <NavLink> and other means (like history.push if enabled) customary to all
  SPAs. Transitions from one SPA to another should be performed using HTML
  anchor element (or its replacement provided by the UI library) targeting the
  other SPA landing page. For example:
  <a href="/first.html"> or <Menu.Item href="/second.html">.

Note: To facilitate debugging, edit the ../.vscode/launch.json file to reflect
  the SPA Configuration block changes. You'll need to adjust the three lines
  with the text "http://localhost:<port>/first.html".
  For example, if you renamed the first SPA from 'first' to 'login' then
  change these three lines to: "http://localhost:<port>/login.html".

To turn off code splitting using multiple SPAs simply leave one SPA in the
SPA Configuration block.
*/

var ConfiguredSPAs = function() {
  function SPA(params) {
    this.params = params;
  }

  /****************** Start SPA Configuration ******************/
  var SPAs = [
    new SPA({
      name: "first",
      entryPoint: "./src/entrypoints/first.tsx",
      ssr: true,
      redirect: true
    }),
    new SPA({
      name: "second",
      entryPoint: "./src/entrypoints/second.tsx",
      ssr: false,
      redirect: false
    })
  ];

  SPAs.appTitle = "Crisp React";
  /****************** End SPA Configuration ******************/

  SPAs.verifyParameters = function(verifier) {
    if (SPAs.length === 0) {
      throw new RangeError("At least one SPA needs to be configured");
    }

    SPAs.forEach(function(spa, idx) {
      spa.params = verifier(spa.params, idx);
    });

    var num = SPAs.reduce(function(acc, item) {
      return item.params.redirect ? acc + 1 : acc;
    }, 0);

    if (num !== 1) {
      throw new RangeError("One and only one SPA must have 'redirect: true'");
    }

    SPAs.forEach(function(spa) {
      var spaName = spa.params.name.toLowerCase();
      var spas = SPAs.filter(function(item) {
        return item.params.name.toLowerCase().startsWith(spaName);
      });

      if (spas.length !== 1) {
        throw new RangeError("SPAs have names that are not distinct enough");
      }
    });
  };

  SPAs.getEntrypoints = function() {
    var entryPoints = new Object();
    SPAs.forEach(function(spa) {
      entryPoints[spa.params.name] = spa.params.entryPoint;
    });
    return entryPoints;
  };

  SPAs.getRedirectName = function() {
    return SPAs.find(function(spa) {
      return spa.params.redirect;
    }).params.name;
  };

  SPAs.getSsrNames = function() {
    var spas = SPAs.filter(function(spa) {
      return spa.params.ssr;
    });
    return spas.map(function(spa) {
      return spa.params.name;
    });
  };

  SPAs.getNames = function() {
    var spaNames = [];
    SPAs.forEach(function(spa) {
      spaNames.push(spa.params.name);
    });
    return spaNames;
  };

  SPAs.getRewriteRules = function() {
    var ret = [];
    SPAs.forEach(function(spa) {
      var rule = new Object();
      rule.from = new RegExp("^/" + spa.params.name + "(\\.html)?$");
      rule.to = spa.params.name + ".html";
      ret.push(rule);
    });
    ret.push({
      from: new RegExp("^.*$"),
      to: "/" + SPAs.getRedirectName() + ".html"
    });
    return ret;
  };

  return SPAs;
};

module.exports = ConfiguredSPAs();
