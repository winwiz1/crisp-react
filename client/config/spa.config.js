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
reconfigure client, backend and their tests. You'll need to adjust 3 lines in
./.vscode/launch.json: "http://localhost:<port>/first.html". If the first SPA is
called 'login' then change these lines to "http://localhost:<port>/login.html".

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
  let SPAs = [
    new SPA({ name: "first", entryPoint: './src/entrypoints/first.tsx', redirect: true }),
    new SPA({ name: "second", entryPoint: './src/entrypoints/second.tsx', redirect: false }),
  ];

  SPAs.getTitle = () => "Crisp React";
  /****************** End SPA Configuration ******************/

  SPAs.verifyParameters = (verifier) => {

    if (SPAs.length === 0) {
      throw new RangeError("At least one SPA needs to be configured")
    }

    SPAs.forEach((spa,idx) => {
      spa.params = verifier(spa.params, idx);
    });

    const num = SPAs.reduce((acc, item) => { return item.params.redirect? acc + 1: acc; }, 0);
    if (num !== 1) {
      throw new RangeError("One and only one SPA must have redirect=true")
    }
  }

  SPAs.getEntrypoints = () => {
    let ret = new Object();
    SPAs.forEach(spa => ret[spa.params.name] = spa.params.entryPoint);
    return ret;
  }

  SPAs.getRedirectName = () => {
    return SPAs.find(spa => spa.params.redirect).params.name;
  }

  SPAs.getNames = () => {
    let ret = new Array();
    SPAs.forEach(spa => ret.push(spa.params.name));
    return ret;
  }

  SPAs.getRewriteRules = () => {
    let ret = new Array();
    SPAs.forEach(spa => {
      let rule = new Object();
      rule.from = new RegExp(`^/${spa.params.name}` + "(\\.html)?$");
      rule.to = `${spa.params.name}.html`;
      ret.push(rule);
    });
    ret.push({ from: new RegExp("^.*$"), to: `/${SPAs.getRedirectName()}.html` });
    return ret;
  }
  
  return SPAs;
};

module.exports = ConfiguredSPAs();
