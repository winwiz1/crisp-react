/*
Crisp React supports splitting React application into several SPAs.

Each SPA has:
- name (e.g. 'first' or 'login' or 'reporting' etc.). Used to define the 
  SPA landing page (e.g. /first.html or /login.html) and name the bundle 
  that renders the SPA: first<hash>.js
- entryPoint component (or to be precise a .tsx file with the code that
  renders the landing page of the SPA). Webpack calls it entry point.
- redirect flag. If set to true, makes webserver redirect to the landing page
  of this SPA when serving requests with unknown request path. It's standard
  behavior required by all SPAs and implemented in webpack-dev-server using
  the 'historyApiFallback' setting. Only one SPA can have this flag set to
  exclude redirection ambiguity.

You can customize SPAs by modifying the SPA Configuration block below. It will
reconfigure client, backend and the tests. You'll need to adjust 3 lines
"http://localhost:<port>/first.html" in the ../.vscode/launch.json file.
If the first SPA is called 'login' then change these lines to:
"http://localhost:<port>/login.html".

Note: Page transitions within an SPA are performed as usual using <Link>,
  <NavLink> and other means (like history.push if enabled) customary to all
  SPAs. Transitions from one SPA to another should be performed using HTML
  anchor element (or its replacement provided by the UI library) targeting the
  other SPA landing page:
  <a href="/first.html"> or <Menu.Item href="/second.html">.

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
      redirect: true
    }),
    new SPA({
      name: "second",
      entryPoint: "./src/entrypoints/second.tsx",
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
  };

  SPAs.getEntrypoints = function() {
    var entryPoints = new Object();
    SPAs.forEach(spa => (entryPoints[spa.params.name] = spa.params.entryPoint));
    return entryPoints;
  };

  SPAs.getRedirectName = function() {
    return SPAs.find(spa => spa.params.redirect).params.name;
  };

  SPAs.getNames = function() {
    var spaNames = new Array();
    SPAs.forEach(spa => spaNames.push(spa.params.name));
    return spaNames;
  };

  SPAs.getRewriteRules = function() {
    var ret = new Array();
    SPAs.forEach(spa => {
      var rule = new Object();
      rule.from = new RegExp(`^/${spa.params.name}` + "(\\.html)?$");
      rule.to = `${spa.params.name}.html`;
      ret.push(rule);
    });
    ret.push({
      from: new RegExp("^.*$"),
      to: `/${SPAs.getRedirectName()}.html`
    });
    return ret;
  };

  return SPAs;
};

module.exports = ConfiguredSPAs();
