<div align="center">
  <a href="https://github.com/winwiz1/crisp-react">
    <img alt="crisp-react logo" src="docs/crisp-react.png">
  </a>
  <br />
  <br />
  <h1>Crisp React</h1>
</div>
Starter project with React client and NodeJS/Express backend, both written in Typescript. Offers extended functionality highlighted below. The client works with any webserver.
<br /><br />
<div align="center">
  <img alt="Travis CI badge" src="https://travis-ci.com/winwiz1/crisp-react.svg?branch=master">
  <img alt="Language badge. Sometimes timeouts - please reload." src="https://img.shields.io/github/languages/top/winwiz1/crisp-react">
  <img alt="Snyk Vulnerabilities badge" src="https://img.shields.io/snyk/vulnerabilities/github/winwiz1/crisp-react">
  <img alt="License badge" src="https://img.shields.io/github/license/winwiz1/crisp-react">
</div>

## Table of Contents

- [Project Highlights](#project-highlights)
  - [React application splitting](#react-application-splitting)
  - [Debugging functionality](#debugging-functionality)
  - [Script bundle management](#script-bundle-management)
- [Getting Started](#getting-started) 
- [Project Features](#project-features)
  - [Using Typescript](#using-typescript) 
  - [Client and backend subprojects](#client-and-backend-subprojects)
  - [Integration with UI and CSS libraries](#integration-with-ui-and-css-libraries)
  - [Testing](#testing)
- [Usage](#usage)
  - [Client Usage Scenarios](#client-usage-scenarios)
  - [Backend Usage Scenarios](#backend-usage-scenarios)
- [What's Next](#whats-next)
- [Q & A](#q--a)
- [License](#license)

## Project Highlights

#### React application splitting
[Create React App](https://github.com/facebook/create-react-app) creates a client app that consists of one Single Page Application (SPA). When dealing with a feature-rich application, it's often beneficial to split it into several units. For React, SPA fits the role of such a unit quite naturally. Each SPA can be responsible for its own area of functionality.  For example, one SPA can offer an introductory set of screens for the first-time user or handle login. Another SPA could implement the rest of the application, except for Auditing or Reporting that can be catered for by yet another SPA. When Crisp React project is built, it creates a client application with two SPAs.  This number can be increased or decreased by modifying the project.

#### Debugging functionality
Features simultaneous client and backend debugging. You can launch a debugging configuration in VS Code that starts the client and the backend so that breakpoints can be set in both. This is complimented by other debugging scenarios described below including debugging on the production client using its Typescript source code in either VS Code or Chrome DevTools.

#### Script bundle management
The script bundles for all SPAs are built by webpack in one go and tagged uniquely for the build to make it caching safe. Having a separate bundle for each SPA  improves its loading time. The `vendor` bundle with all dependencies including React library is reused between SPAs so that there is no need to download it again when switching from one SPA to another. The performance is further increased by the production build using bundle minification and offering several compression choices to clients e.g. Brotli, gzip or uncompressed.
## Getting Started
Install `yarn` if it's not already installed: `npm install yarn -g`

<div>
  <details>
    <summary><strong>With VS Code</strong></summary>
    <br />
    Prerequisites: Chrome and VS Code with 'Debugger for Chrome' extension.<br />
    <ul>
      <li>Clone the <code>crisp-react</code> repository:<br/>
        <br/>
        <code>git clone https://github.com/winwiz1/crisp-react.git</code><br/>
        <code>cd crisp-react</code><br/>
        <br/>
      </li>
      <li>Install dependencies:
        <p>
          <code>yarn install</code>
        </p>
      </li>
      <li>Open the workspace file in VS Code:
        <p>
          <code>code ./crisp-react.code-workspace</code>
        </p>
      </li>
      <li>Start the debugging configuration <code>'Debug Client and Backend (workspace)'</code>.</li>
      <br/>
      <li>Wait until an instance of Chrome starts. You should see this page:
        <p>
          <img alt="Overview Page" src="https://winwiz1.github.io/crisp-react/docs/screenshots/OverviewPage.png">
        </p>
        <br/>
      </li>
      <li>Stop the running debugging configuration (use the 'Stop' button on VS Code Debugging toolbar two times or press <code>Control+F5</code> twice).</li>
    </ul>
  </details>
</div>
<div>
  <details>
    <summary><strong>Without VS Code</strong></summary>
    <br />
    After executing the following commands:<br/>
	<br/>
    <code>  git clone https://github.com/winwiz1/crisp-react.git</code><br/>
    <code>  cd crisp-react</code><br/>
    <code>  yarn install && yarn start:prod</code><br/>
    <br/>
    you will have a running instance of backend (e.g. Express) serving the newly built React app that can be seen by pointing a browser to <code>localhost:3000</code>.<br/>
    Terminate the backend by pressing <code>Control+C</code>.
  </details>
</div>
  
## Project Features
#### Using Typescript
Both the client application and the backend are written in Typescript.
#### Client and backend subprojects
The client subproject:
 * Starts webpack-dev-server listening on port 8080 in the development mode.
 * Creates build artifacts (html files, script bundles and source maps) in the production mode. The artifacts are meant to be copied over to the backend subproject to be served by Express.
 * Additionally can start an instance of Chrome controlled via Inspector protocol and point it to either webpack-dev-server or the backend server.
> webpack-dev-server can be referred to as 'devserver'.

The backend subproject:
 * In the production mode starts Express listening on port 3000 to serve from disk the build artifacts created by the client subproject .
 * In the development mode starts Express listening on the same port and working as webpack-dev-server proxy for the client-side resources (such as a bundle or .html file or a source map).
#### Integration with UI and CSS libraries
Both libraries ( [Semantic UI](https://react.semantic-ui.com) and [Typestyle](https://typestyle.github.io) respectively ) provide React with the type safety afforded by Typescript.
#### Testing
Debuggable test cases written in Typescript. Integration with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) on the client and [Supertest](https://github.com/visionmedia/supertest) on the backend. Both using [Jest](https://jestjs.io/) as an engine.

The repository is integrated with Travis CI and the test outcome is reflected by the test badge.


## Usage
The Usage Scenarios below are grouped depending on whether  the client or the backend subproject is used. 

The expression "backend data" that is "required" in some scenarios below and "not needed" in others refers to the data supplied via future backend API endpoint - see What’s Next. In other words this data is some 'extra' that Express will provide but webpack-dev-server won't. For example, data retrieved from a cloud service which the client cannot touch directly. 

The commands executed in VS Code Terminal windows can be executed from command or shell prompt in the relevant  directory and vice versa.

### Client Usage Scenarios
To start with client scenarios open the `client` subdirectory in VS Code. Then open the Terminal. 
#### Run devserver and use Live Reloading
Execute in Terminal: `yarn dev`. Wait until the command finishes.<br/>
Start a browser and point it to `localhost:8080`. You should see the First SPA overview page.<br/>
VS Code: Open `src/components/Overview.tsx` and alter the text on the page. As you type, note the compilation progress in the Terminal followed by automatic browser refresh. The newly typed content should be shown on the overview page. If instead of starting a browser you used already running instance, then you might need to refresh the browser to get Live Reloading working.<br/>
To finish press `Control+C` in the Terminal.<br/>
When to use: Develop the part of UI that doesn't need backend data. 
#### Debug client using devserver and VS Code
VS Code: Start the `Launch Chrome Connected to Devserver` debugging configuration.<br/> 
Wait until an instance of Chrome starts and shows the overview page.<br/>
VS Code: Put a breakpoint on the following line: `src/components/ComponentB.tsx:13`.<br/>
Use the overview page menu to choose the ComponentB. The breakpoint in VS Code will be hit. Press F5 to continue execution. Alternatively use Chrome to continue execution.<br/>
To finish remove the breakpoint and stop the running debugging configuration (use Debugging toolbar or press `Shift+F5`).<br/>
When to use: Troubleshoot the client provided backend data is not required.
#### Debug client using devserver and Chrome DevTools
Follow the "Debug client using devserver and VS Code" scenario  to see the overview page.<br/>
In the instance of Chrome started, open Chrome DevTools.<br/>
Use 'Sources -> Filesystem -> Add folder to workspace' to add `client/src` directory. In this directory open the file `src/components/ComponentB.tsx` and put a breakpoint on the line 13.<br/>
Use the overview page menu to choose the ComponentB. The breakpoint in Chrome DevTools will be hit. Go to VS Code and note it knows the execution has stopped on this line of code and lets you inspect variables. Use Chrome or VS Code to continue execution.<br/>
To finish remove the breakpoint and stop the running debugging configuration (use Debugging toolbar or press `Shift+F5`).<br/>
When to use: Troubleshoot UI, inspect DOM tree, etc. provided backend data is not required.
#### Build client for development or production
To perform the development build execute in Terminal: `yarn build`<br/>
The build artifacts can be found under `client/dist` directory.<br/>
To perform the production build execute in Terminal: `yarn build:prod`.<br/>
When to use: As a preparatory step when the backend is required. This step will be executed by the backend usage scenarios below as needed.
#### Test client
Terminal: `yarn test`
#### Debug client test cases
VS Code: Put a breakpoint in any `.test.tsx` file.<br/>
VS Code: Start 'Debug Jest Tests' debugging configuration. Wait until the breakpoint is hit.<br/>
To finish remove the breakpoint and stop the running debugging configuration (use Debugging toolbar or press `Shift+F5`).
#### Lint client
Terminal: `yarn lint`
### Backend Usage Scenarios 
#### Run backend in production mode
Open a command prompt in the directory containing the workspace file `crisp-react.code-workspace` .<br/>
Execute command: `yarn start:prod`.<br/>
To stop the backend terminate the running command e.g. press `Control+C`.
#### Run backend with Live Reloading
Open the workspace file  `crisp-react.code-workspace`  in VS Code.<br/>
Start the debugging configuration `Debug Client and Backend (workspace)`.<br/>
Wait until an instance of Chrome starts. You should see the overview page.<br/>
VS Code: Open `client/src/components/Overview.tsx` and alter the text on the page. After a few seconds delay the new content should be shown in the browser.<br/>
To finish stop the running debugging configuration (use the ‘Stop’ button on VS Code Debugging toolbar two times or press  <code>Control+F5</code>  twice).
#### Test backend
Open a command prompt in the `server` subdirectory.<br/>
Execute command: `yarn test`
#### Debug backend test cases
Open the `server` subdirectory in VS Code.<br />
Put a breakpoint in `.test.tsx` file.<br/>
Start 'Debug Jest Tests' debugging configuration. Wait until the breakpoint is hit.<br/>
To finish remove the breakpoint and stop the running debugging configuration.
#### Lint backend
Open a command prompt in the `server` subdirectory.<br/>
Execute command: `yarn lint`
#### Debug backend and client simultaneously
Open the workspace file  `crisp-react.code-workspace`  in VS Code.<br/>
Start the debugging configuration  `Debug Client and Backend (workspace)`.<br/>
Wait until an instance of Chrome starts. You should see the overview page.<br/>

<div>
  <details>
    <summary>Using VS Code example:</summary>
    <br/>
    In order to set breakpoints in VS Code you will need to choose either client or backend e.g. highlight the client or the backend process on the Debug sidebar inside the Call Stack window. Otherwise you can get "Unverified breakpoint". Once a breakpoint is set, it doesn't matter which process is selected/highlighted.<br/>
    <br/>
    Select the backend process and put a breakpoint on the following line:  <code>server/src/Server.ts:49</code>.<br/>
    In the browser choose ComponentA from the menu, the breakpoint will be hit. Remove the breakpoint and resume the execution.<br/>
    Select the client process and put a breakpoint on the line <code>client/src/components/ComponentB.tsx:13</code>.<br/> 
    Use the overview page menu to choose the ComponentB, the breakpoint will be hit. Remove the breakpoint and resume the execution. Choose ComponentA.<br/>
  </details>
</div>
<div>
  <details>
    <summary>Using Chrome DevTools example:</summary>
    <br />
    In the instance of Chrome started, open Chrome DevTools.<br/>
    Use 'Sources -> Filesystem -> Add folder to workspace' to add <code>client/src</code> directory. In this directory open the file <code>src/components/ComponentB.tsx</code> and put a breakpoint on line 13.<br/>
    Use the overview page menu to choose the ComponentB. The breakpoint in Chrome DevTools will be hit. Remove the breakpoint and use Chrome or VS Code to continue execution.
  </details>
</div>

To finish stop the running debugging configuration (use the ‘Stop’ button on VS Code Debugging toolbar two times or press  <code>Control+F5</code>  twice).
#### Use backend to debug the production client build
Open the workspace file  `crisp-react.code-workspace`  in VS Code.<br/>
Edit file `client/webpack.config.js` to change the `sourceMap` setting of the TerserPlugin config to `true`.<br/>
Start the debugging configuration  `Debug Production Client and Backend (workspace)`.<br/>
Wait until an instance of Chrome starts. You should see the overview page. Now you can use VS Code to set breakpoints in both client and backend provided the relevant process is highlighted/selected as explained in the previous scenario. You can also use Chrome DevTools to debug the client application as shown above.<br/>
To finish stop the running debugging configuration (use the Debugging toolbar or press  `Control+F5`  once).
## What's Next
Add an API endpoint to the backend and consume it by adding some data fetching capability to the client.
## Q & A
Q: I use Apache/IIS/ASP.NET Core, not Express. Can I use the client project and what needs to be changed.<br/>
A: Yes you can. The client project located in the `client` subdirectory is fully self-contained and can be used without any changes. The client related usage scenarios do not require any modifications.

Q: The client project does not have .html file(s). How can I add my own HTML.<br/>
A: You can add .html snippet file to the project and change the `HtmlWebpackPlugin` configuration in `webpack.config.js` to include the content of your snippet into the generated .html files. That's how you would include polyfills etc. Look for the [headHtmlSnippet](https://github.com/jaketrent/html-webpack-template) configuration setting (and the bodyHtmlSnippet setting), it accepts a name of .html file. 

Q: How can I fix Typescript compilation errors. <br/>
A: Note the Typescript version in `package.json`. Ensure the Typescript version shown at the VS Code status bar when .ts or .tsx file is opened is not lower.

Q: Breakpoints in Chrome DevTools are not hit. How can I fix it.<br/>
A: Open the Settings page of the Chrome DevTools and ensure 'Enable JavaScript source maps' and 'Disable cache (while DevTools is open)' boxes are ticked. Close the Settings page and on the Network tab tick the 'Disable cache' box. If debugging a production build, change the `sourceMap` setting of the TerserPlugin config to `true` in `webpack.config.js`, then restart debugging.

Q: Breakpoints in VS Code are not hit. How can it be fixed.<br/>
A: Try to remove the breakpoint and set it again. If the breakpoint is in the client code, refresh the browser.
## License
Crisp React project with its 'server' and 'client' subprojects is open source software [licensed as MIT](./LICENSE).
