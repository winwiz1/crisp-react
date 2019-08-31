<div align="center">
  <a href="https://github.com/winwiz1/crisp-react">
    <img src="docs/crisp-react.png">
  </a>
  <br />
  <br />
  <h1>Crisp React</h1>
</div>
Starter project with React client and NodeJS/Express server, both written in Typescript. Offers seamless client and server-side debugging, advanced features like several React SPAs (Single Page Applications) under one roof and many optimizations explained below. The client works with any webserver.

## Table of Contents

- [Features and Motivation](#features-and-motivation)
- [Get Started Quickly](#get-started-quickly)
- [Usage](#usage)
  - [Details](#details)
  - [Specific Usage Scenarios](#specific-usage-scenarios)
- [What's Next](#whats-next)
- [Q & A](#q--a)
- [License](#license)
## Features and Motivation
When I started working on a React/Express project I wanted to find a sample featuring the following:

1. __Typescript.__<br/>
Both server and client written in Typescript.
2. __Client and server projects.__<br/>
Separate projects and `package.json` files for the server and the client. Each with its own set of dependencies that are expected to be rather different for the client and the server.
3. __Debug client and server simultaneously.__<br/>
Ability to debug both client and server using two instances VS Code. E.g. set breakpoints in Typescript code, get a client breakpoint hit in one VS Code instance, resume execution and get a server breakpoint hit in another VS Code instance.
4. __Debug client only.__<br/>
Ability to debug client using one instance of VS Code in cases when server responses are not required. For example, start the client and look at the initial page rendering.<br/>
Speed up development with Live Reloading. Make some Typescript code changes and see the page updated automatically in the browser as you type without any explicit effort to recompile the client or refresh the browser.
5. __Debugging using Chrome DevTools.__<br/>
Debugging using VS Code is convenient but occasionally I want to find out why the padding of that DOM element is not what expected or perform other browser related tasks. Chrome DevTools help with that and I want to use it to set breakpoints in Typescript, not in transpiled JS.
6. __Script bundler.__<br/>
Use a bundler, preferably [Webpack](https://webpack.js.org/) with its rich set of plugins, to produce script bundles in order to get the pages to load faster. Even with HTTP/2, bundling remains important because typically there are many transitive dependencies between React components. HTTP/2 with its concurrent requests support doesn’t help in situations when a client downloads one JS file (that a React component is transpiled to) and discovers dependencies on other components which results in sequential round-trips to the server.<br/>
Also JS files will be bulk-compressed more efficiently when bundled together as opposed to the case of many individual file compressions.

7. __Have development and production builds.__ <br/>
The latter should trigger the production build option for all the client and server dependencies. It results in smaller and faster code for many NPM packages.<br/>
In production build the webserver should offer different bundle compressions for clients to choose from e.g. Brotli for modern clients, gzip for others.<br/>
Using descriptive and somewhat longer names for components and methods improves maintainability of the code however it shouldn’t increase the download size, so we need bundle minification. We want to debug production builds using the original Typescript source code in spite of minification.
<hr />
I looked for such a sample and didn’t find one that would have all the features. Hopefully this project could address the above needs and additionally offer:

8. __Several React SPAs under one roof.__<br/>
Each with its own script bundle, making bundles smaller and further improving load times. For example one SPA can offer an introductory set of screens for the first-time user or handle authentication. Another SPA could implement the rest of the application, except for Auditing that can be rendered by a bundle which belongs to yet another SPA. Each SPA can be developed by a developer or a development team producing a separate bundle.
Having more than one SPA is optional.

9. __Script bundle management.__ <br/>
Bundles are given names unique to the given build (e.g. `mybundle.<build hash>.js`) so that they can be safely cached long-term. The name is embedded into the relevant .html file.<br/>
Code taken from the NPM packages used by client is packaged into a separate bundle so that there is no need for the browser to download this code again when switching from one SPA to another.
10. __Integration with UI and CSS libraries.__<br/>
Both libraries should provide React code with type safety afforded by Typescript. I have chosen [Semantic UI](https://react.semantic-ui.com) and [Typestyle](https://typestyle.github.io).
11. __Testing.__<br/>
Debuggable test cases written in Typescript. Integration with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) on the client and [Supertest](https://github.com/visionmedia/supertest) on the server. Both using [Jest](https://jestjs.io/) as an engine.

## Get Started Quickly
* Install `yarn` if it's not already installed:
```sh
$ npm install yarn -g
```
* Clone the repo. It comes with two sub-directories: `client` and `server`.

* Open command prompt (on Windows use cmd.exe, not PowerShell) and install the dependencies by executing `yarn` in both sub-directories. Then build the client and start the server:
```sh
$ cd client && yarn && yarn build
$ cd ..
$ cd server && yarn && yarn start
$ cd ..
```
* Start a browser and point it to `localhost:3000`. You should see this page:

![Overview page](docs/screenshots/OverviewPage.png)
## Usage
### Details
> You can skip Details and go to Specific Usage Scenarios.

The client project is capable of:
* Starting webpack-dev-server. It will cause webpack to compile Typescript code and create build artifacts (script bundles, .html files, source maps) in memory. Then webpack-dev-server will serve it from memory, not from disk.<br/>
There are extra configuration settings in place to force writing the build artifacts to disk (in the interests of the server project), however once the files are written on disk, they are largely unused by the client project. This facilitates Live Reloading.
> webpack-dev-server will listen on port 8080.
* Creating build artifacts without starting webpack-dev-server. The artifacts built are meant to be copied over to the server project to be served by Express.
* Starting an instance of Chrome controlled via Inspector protocol and pointing it to webpack-dev-server. Requires VS Code with 'Debugger for Chrome' extension. Alternatively you can start any browser as you usually do and point it to `localhost:8080`. 

The server project is capable of:
* Production mode: starting Express to serve from disk the build artifacts created by the client project.
* Development mode: starting Express in a mode of operation when it asks webpack-dev-server for client-side resources (such as a bundle or .html file or a source map).
> In both cases Express will be listening on port 3000.

### Specific Usage Scenarios
To start open the `client` sub-directory in VS Code, it will have a green toolbar. Open the `server` sub-directory in another VS Code instance, its toolbar will be blue. Then open the Terminal inside each instance of VS Code. 

I'll refer to both VS Code instances and Terminal windows as 'green' or 'blue'. If using colors is not an option then these words can be used interchangeably with 'client' and 'server' respectively. 

To follow the chosen scenario execute the steps listed for it in the given order. The expression "run client" means running the development webserver called webpack-dev-server that is included into the client project whereas "debug client" means debugging some script executed inside a browser. As for the server project, both "run server" and "debug server" refer to the Express webserver and the code it is executing. 

The expression "server data" that is "required" in some scenarios below and "not needed" in others refers to data supplied via future API endpoint - see What’s Next. In other words this data is some 'extra' that Express will provide but webpack-dev-server won't. For example, data retrieved from a backend cloud service which the client cannot touch directly. 

* __Install dependencies__<br/>
Green Terminal: `yarn`<br/>
Blue Terminal: `yarn`

* __Run client__<br/>
Green Terminal: `yarn dev`.<br/>
Wait until the command finishes.<br/>
Start a browser and point it to `localhost:8080`. You should see the First SPA overview page.<br/>
To finish press `Control+C` in green Terminal.<br/>
When to use: Test UI while the server is unavailable.
* __Run client and use Live Reloading__<br/>
Follow the "Run client" steps to see the First SPA overview page.<br/>
Green VS Code: Open `src/Overview.tsx` and alter the text on the page. As you type, note the compilation progress in the Terminal followed by automatic browser refresh. The newly typed content should be shown on the overview page. If instead of starting a browser you used already running instance, then you might need to refresh the browser to get Live Reloading working.<br/>
To finish press `Control+C` in green Terminal.<br/>
When to use: Develop UI provided server data is not needed. 
* __Debug client using VS Code__<br/>
Make sure the Debugger for Chrome extension for VS Code is installed.<br/>
Green VS Code: Start the 'Launch Chrome' debugging configuration.<br/> 
Wait until an instance of Chrome starts and shows the overview page.<br/>
Green VS Code: Put a breakpoint on the following line: `src/ComponentB.tsx:13`.<br/>
Use the overview page menu to choose the ComponentB. The breakpoint in VS Code will be hit. Press F5 to continue execution. Alternatively use Chrome to continue execution.<br/>
To finish remove the breakpoint and stop the running debugging configuration (use toolbar or press `Shift+F5`).<br/>
When to use: Troubleshoot client provided server data is not required.
* __Debug client using Chrome DevTools__<br/>
Follow the "Debug client using VS Code" step to see the overview page.<br/>
In the instance of Chrome started, open Chrome DevTools.<br/>
Use 'Sources -> Filesystem -> Add folder to workspace' to add `client/src` directory. In this directory open the file `src/ComponentB.tsx` and put a breakpoint on line 13 (which does logging).<br/>
Use the overview page menu to choose the ComponentB. The breakpoint in Chrome DevTools will be hit. Go to VS Code and note it knows the execution has stopped on this line of code and lets you inspect variables. Use Chrome or VS Code to continue execution.<br/>
To finish remove the breakpoint and stop the running debugging configuration.<br/>
When to use: Troubleshoot UI provided server data is not required.
* __Build client__<br/>
Green Terminal: `yarn build`<br/>
The build artifacts can be found under `client/dist` directory.<br/>
To perform production build execute `yarn build:prod`.<br/>
When to use: As a preparatory step when the server is required.
* __Test client__<br/>
Green Terminal: `yarn test`
* __Debug client test cases__<br/>
Green VS Code: Put a breakpoint in any `.test.tsx` file.<br/>
Green VS Code: Start 'Debug Jest Tests' debugging configuration. Wait until the breakpoint is hit.<br/>
To finish remove the breakpoint and stop the running debugging configuration.
* __Lint client__<br/>
Green Terminal: `yarn lint`
---
* __Run server__<br/>
Green Terminal: `yarn build`.<br/>
Wait until the command finishes. It can be skipped if no changes were made to the client project since this command was last executed.<br/>
Blue Terminal: `yarn start`. <br/>
Point a browser to `localhost:3000`, it should display the overview page.<br/>
To finish press `Control+C` in blue Terminal.<br/>
When to use: Test server and/or client when the server data is required.

* __Run server in production mode__<br/>
Follow all the steps of the "Run server" scenario with different commands:<br/>
Green Terminal: `yarn build:prod`.<br/>
Blue Terminal: `yarn start:prod`. 
* __Debug server__<br/>
Green Terminal: `yarn build`. Wait until the command finishes.<br/>
Blue Terminal: `yarn copy`.<br/>
The above commands in both Terminals can be skipped if no changes were made to the client project since those command were last executed.<br/>
Blue VS Code: Put a breakpoint on the following line: `src/Server.ts:49` and start the 'Debug Server' debugging configuration.<br/>
In the browser choose ComponentA from the menu, the breakpoint will be hit. Resume the execution.<br/>
Note that if you change source code in blue VS Code, the changes are recompiled and applied as you type.<br/>
To finish remove the breakpoint and stop the debugging configuration (use toolbar or press `Shift+F5`).<br/>
When to use: Troubleshoot server code when it is not beneficial to debug the client at the same time.
* __Test server__<br/>
Blue Terminal: `yarn test`
* __Debug server test cases__<br/>
Blue VS Code: Put a breakpoint in `.test.tsx` file.<br/>
Blue VS Code: Start 'Debug Jest Tests' debugging configuration. Wait until the breakpoint is hit.<br/>
To finish remove the breakpoint and stop the running debugging configuration.
* __Lint server__<br/>
Blue Terminal: `yarn lint`
---
* __Run server and perform client debugging using Chrome DevTools__<br/>
Green Terminal: `yarn build`. Wait until the command finishes.<br/>
Blue Terminal: `yarn start`.<br/>
Point Chrome to `localhost:3000` and open Chrome DevTools.<br/>
Use 'Sources -> Filesystem -> Add folder to workspace' to add `client/src` directory. In this directory open the file `src/ComponentB.tsx` and put a breakpoint on the line 13.<br/> 
Use the overview page menu to choose the ComponentB. The breakpoint will be hit. Use Chrome to continue execution.<br/>
To finish press `Control+C` in blue Terminal.<br/>
When to use: Troubleshoot UI when server data is required.

* __Run server in production mode and perform client debugging using Chrome DevTools__<br/>
Green VS Code: Change the `sourceMap` setting of the TerserPlugin config to `true` in `webpack.config.js`<br/>
Perform all the steps of the above scenario with different commands:<br/>
Green Terminal: `yarn build:prod`.<br/>
Blue Terminal: `yarn start:prod`.
* __Debug client and sever simultaneously__<br/>
Green VS Code: Start 'Launch Chrome' debugging configuration.<br/>
Wait until an instance of Chrome starts and shows the overview page on port 8080.<br/>
Blue VS Code: Start 'Debug Server Connected To Client' debugging configuration.<br/>
In the address bar of the started instance of Chrome change the port to 3000 and press enter.<br/>
Now you can set breakpoints in both instances of VS Code. For example, let's set one client and one server breakpoint.<br/>
Green VS Code: Put a breakpoint on the following line: `src/ComponentB.tsx:13`. Then use the overview page menu to choose the ComponentB. The breakpoint will be hit. Continue execution.<br/>
Blue VS Code: Put a breakpoint on the following line: `src/Server.ts:49`. Choose ComponentA, the breakpoint will be hit. Remove the breakpoint and continue execution.<br/>
To finish stop the running debugging configurations in both instances of VS Code.<br/>
When to use: Troubleshooting cases when it is helpful to debug both the client and the server at the same time.


## What's Next
Add an API endpoint to the server and consume it by adding some data fetching capability to the client. In the future I'll add another repository with a project built upon Crisp React which does that.
## Q & A
Q: I use Apache/IIS/ASP.NET Core, not Express. Can I use the client project and what needs to be changed.<br/>
A: Yes you can. The client project located in the `client` sub-directory is fully self-contained and can be used without any changes to get the following features fully implemented: 1, 4-11. The client related Usage Scenarios do not require any modifications.
 
Q: The client project does not have .html file(s). How can I add my own HTML.<br/>
A: You can add .html snippet file to the project and change the `HtmlWebpackPlugin` configuration in `webpack.config.js` to include the content of your snippet into the generated .html files. That's how you would include polyfills etc. Look for the [headHtmlSnippet](https://github.com/jaketrent/html-webpack-template) configuration setting (and the bodyHtmlSnippet setting), it accepts a name of .html file. 

Q: How can I fix Typescript compilation errors. <br/>
A: Note the Typescript version in `package.json`. Ensure the Typescript version shown at the VS Code status bar when .ts or .tsx file is opened is not lower.

Q: Breakpoints in Chrome DevTools are not hit. How can I fix it.<br/>
A: Open the Settings page of the Chrome DevTools and ensure 'Enable JavaScript source maps' box is ticked. If using a production build, change the `sourceMap`setting of the TerserPlugin config to `true` in `webpack.config.js`, then re-execute the `yarn build:prod` command.

Q: Breakpoints in VS Code are not hit. How can it be fixed.<br/>
A: Try to remove the breakpoint and set it again. If the breakpoint is in the client code, refresh the browser.

Q: There is a multi-root workspace `crisp-react.code-workspace`. Can it be used. And more specifically, can its compound launch configuration "Debug Client and Server" be used in the "Debug client and sever simultaneously" scenario.<br/>
A: Yes, it can be used in this particular scenario and others if you prefer to have only one instance of VS Code running. Once you have started the compound launch configuration, remember to stop the two debugging configurations it consists of (use toolbar two times or press `Control+F5` twice).<br/>
In order to set breakpoints you will need to choose either client or server e.g. highlight the client or the server process on the Debug sidebar inside the Call Stack window. Otherwise you can get "Unverified breakpoint". Once a breakpoint is set, it doesn't matter which process is highlighted.

## License
Crisp React project with its 'server' and 'client' sub-projects is open source software [licensed as MIT](./LICENSE).
