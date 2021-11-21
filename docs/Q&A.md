## Q & A
#### Modifying SPA Configuration Block
Q: I have changed both SPA names in the SPA Configuration block and kept the rest including the entry points intact. I expect everything to keep working using my new names for the SPA landing pages instead of the old `/first.html` and `/second.html`.  However navigation via the menu and Back/Forward browser buttons seems to be broken. How can it be fixed.

A: Clear the browser's history and cache. Alternatively use an incognito tab. The client, the backend and the tests should work with the new names.

#### IE Version Support
Q: Which versions of Internet Explorer are supported.

A: This project aims to work with browsers that are supported by vendors and can be made secure via security updates. Therefore IE11 is supported whereas IE10 and the earlier versions are not. The unsupported versions render a blank page with explanatory [message](https://github.com/winwiz1/crisp-react/blob/master/client/src/entrypoints/head-snippet.html#L8-L10) asking to upgrade.

#### Dynamic Imports
Q: Can I use dynamic imports in addition to multiple SPAs for code splitting?

A: Yes, dynamic imports are fully supported. For example, if there is a Reporting bundle and one component is known to be used infrequently, then it's a good candidate to be separated from the bundle using a dynamic import:
```js
const ReportingWrapperXXX = React.lazy(() => import(
  /* webpackChunkName: "reporting-xxx" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: "false" */
  '<path>/InfrequentReporting'
));
...
// Can have its own Redux store to coexist with the main Redux store
export const ReportingPanelXXX: React.FC = _props => {
  return (
    <Provider store={reportingStoreXXX}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <ReportingWrapperXXX />
      </React.Suspense>
    </Provider>
  );
}
```
Remember to change the settings in `tsconfig.json`:
```
"removeComments": false,
"module": "esnext",
```
 otherwise the dynamic import will be ignored and webpack 'magic comments' removed.
 
 > Note: `React.lazy` has a restriction, it works with default exports only. The restriction should be lifted in the future. When webpack detects dynamic imports, it emits code that loads the bundle it created asynchronously and `Suspense/lazy` needs to wait for the loading to complete. This technology is less straightforward and probably less mature than building a static bundle and referencing it via the `<script>` tag  in .html file.

In case you have a utility class used infrequently, it can also be imported dynamically. This can be done using `await import` and without `Suspense/lazy`. The sibling [Crisp BigQuery](https://github.com/winwiz1/crisp-bigquery) repository (derived from Crisp React)  [provides](https://github.com/winwiz1/crisp-bigquery/search?q=%22await+import%22) a working example.

#### Dynamic Imports vs SPAs
Q: Do dynamic imports negate the need to have multiple SPAs.<br/>
A: It depends. These two are complementary techniques. Obviously once a bundle grows larger, it starts affecting performance as its loading time increases. But the reverse is also true, having too many small bundles could result in more network round-trips and the bundle compression will become less efficient. It can also complicate attempts to scrutinise network traffic including requests for bundles.

#### Tailoring Auto-generated HTML
Q: How can I add my own HTML including polyfills etc. to the generated .html files?

A: Use react-helmet to add additional HTML tags to the `<head>` element and modify the existing ones. Alternatively use the `client\src\entrypoints\head-snippet.html` file. Its content is inserted into the `<head>` element. You can add a [bodyHtmlSnippet](https://github.com/jaketrent/html-webpack-template) by changing the `HtmlWebpackPlugin` configuration in `webpack.config.js` (search for `headHtmlSnippet` and add similar code).

#### Fixing TypeScript Errors
Q: How can I fix TypeScript compilation errors?

A: Note the TypeScript version in `package.json`. Ensure the TypeScript version shown at the VS Code status bar when .ts or .tsx file is opened is not lower.

#### Debugging Using Chrome DevTools
Q: Breakpoints in Chrome DevTools are not working. How can I fix it?

A: Open the Settings page of the Chrome DevTools and ensure 'Enable JavaScript source maps' and 'Disable cache (while DevTools is open)' boxes are ticked. Close the Settings page and on the Network tab tick the 'Disable cache' box. If debugging a production build, change the `sourceMap` setting of the TerserPlugin config to `true` in `webpack.config.js`, then restart debugging.

#### Debugging Using VS Code
Breakpoints in VS Code are not working. How can it be fixed.

A: Try to remove the breakpoint and set it again. If the breakpoint is in the client code, refresh the page.

#### Customising VS Code Debugging Session
Q: I'm debugging the backend in VS Code by running one of the debugging configurations specified in [launch.json](https://github.com/winwiz1/crisp-react/blob/master/server/.vscode/launch.json). How can I get one of the yarn scripts (e.g. `copyfiles` or `prestart` in the `scripts` section of [package.json](https://github.com/winwiz1/crisp-react/blob/master/server/package.json)) executed before the debugging starts?

> This question is inspired by the issue #11

A: What gets executed before a debugging configuration starts is controlled by its optional `preLaunchTask` setting. This setting refers to a task from [tasks.json](https://github.com/winwiz1/crisp-react/blob/master/server/.vscode/tasks.json) by the task name. The name is defined by the tasks'`label` setting. To get a yarn script executed, add another task (let's call it `prestart`) to run the `prestart` script and chain both tasks using `dependsOn`:

<div>
  <details>
    <summary>tasks.json</summary>
    <br />
    <pre>
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "tsc",
      "type": "typescript",
      "tsconfig": "tsconfig.json",
      "problemMatcher": [
        "$tsc"
      ],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "tsc-watch",
      "type": "typescript",
      "tsconfig": "tsconfig.json",
      "option": "watch",
      "problemMatcher": [
        "$tsc-watch"
      ],
      "isBackground": true,
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      },
      "dependsOn": [
        "prestart",
      ]
    },
    {
      "label": "kill process in terminal",
      "type": "process",
      "command": "${command:workbench.action.terminal.kill}"
    },
    {
      "label": "prestart",
      "type": "npm",
      "script": "prestart",
      "presentation": {
        "reveal": "never"
      }
    }
  ]
}
    </pre>
  </details>
</div>

#### Adding Redux
Q: I need to add Redux.

A: Have a look at the sibling Crisp BigQuery repository created by cloning and renaming this solution. It uses Redux.

---
Back to the [README](https://github.com/winwiz1/crisp-react#q--a).


