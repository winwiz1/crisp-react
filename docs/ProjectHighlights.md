## Project Highlights
* Code splitting. Based on the innovative ability to optionally split your React Application into multiple Single Page Applications (SPA). For example, one SPA can offer an introductory set of screens for the first-time user or handle login. Another SPA could implement the rest of the application, except for Auditing or Reporting that can be catered for by yet another SPA. This approach would be beneficial for medium-to-large React applications that can be split into several domains of functionality, development and testing.

    To achieve better performance it's recommended to split when the size of a production bundle reaches 100 KB. In enterprise environment it's recommended to split regardless of bundle size to protect Intellectual Property (by having a Login SPA and making other bundles available for download to authenticated users only) and augment Role Based Access Security (for example, make the Audit bundle available to users who have either Management or Finance role attested in their JWT token) while parallelizing development among several teams.

* Performance. Achieved by webpack tree shaking, script bundle minification and compression (gzip and Brotli).  Complemented by server-side caching and bundle size containment.

    | Benchmarking Tool | Result | Throttling  |
    | :--- |:---:| :---:|
    | Google Lighthouse | ![Run on Google Cloud](benchmarks/100.png) | not throttled |
    | Google Lighthouse | ![Run on Google Cloud](benchmarks/84.png) | throttled to slow 4G,<br/>CPU slowdown |

    The tool is embedded into Chrome so you can easily benchmark yourself. Follow this [link](benchmarks/PERFORMANCE.md) for the details.

    The backend implements HTTP caching and allows long term storage of script bundles in browser's cache that further enhances performance yet supports smooth deployment of versioning changes in production (eliminating the risk of stale bundles getting stuck in the cache).

* SSR. Build-time SSR (also known as prerendering or static generation) is supported. The solution allows to selectively turn the SSR on or off for the chosen parts (e.g. particular SPAs) of the React application. This innovative flexibility is important because as noted by the in-depth [article](https://developers.google.com/web/updates/2019/02/rendering-on-the-web) on this subject, SSR is not a good recipe for every project and comes with costs. For example, the costs analysis could lead to a conclusion the Login part of an application is a good fit for SSR whereas the Reporting module is not. Implementing each part as an SPA with selectively enabled/disabled SSR would provide an optimal implementation and resolve this design disjuncture.

    The SSR related costs depend on:

    - Implementation complexity that results in a larger and more knotty codebase to maintain. That in turn leads to more potential problems while implementing the required functionality, writing test cases and resolving support issues.

    - Run-time computing overhead causing [server delays](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#server-vs-static) (for run-time SSR) that defeat or partially offset the performance benefits of SSR.

    - Run-time computing overhead reducing the ability to sustain workloads (for run-time SSR coupled with complex or long HTML markup) which makes it easier to mount DoS attack aimed at webserver CPU exhaustion. In a case of cloud deployment, the frequency of malicious requests could be low enough to avoid triggering DDoS protection offered by the cloud vendor yet sufficient to saturate the server CPU and trigger autoscaling thus increasing the monetary cost. This challenge can be mitigated using a rate limiter which arguably should be an integral part of run-time SSR offerings.

    Choosing build-time SSR allows to exclude the last two costs and effectively mitigate the first one by providing a concise implementation comprised of just few small source [files](https://github.com/winwiz1/crisp-react/tree/master/client/src/utils/postprocess). The implementation is triggered as an optional post-build step and is consistent with script bundle compression also performed at the build time to avoid loading the webserver CPU.

    Only the landing page of an SPA is prerendered. Other SPA pages are not because those are the internal SPA pages. Switching to the internal pages is performed by SPA without spending time on network trips and hitting the webserver thus lowering its workload and letting it serve more clients simultaneously.

* Overall simplicity. For any starter project or boilerplate, the probability of having bugs/issues down the track increases along with the amount of code. It is shown by the code size badge. The code size of other starter projects was a main motivation to develop this solution. The other projects were enjoyable for learning purposes however the amount of code was perceived to be excessive for use in production.

* Full stack and Jamstack builds.
    <table width=100%>
      <tr>
        <th width=15%>Build option</th>
        <th width=35%>What it does</th>
        <th width=50%>Sample builds</th>
      </tr>
      <tr>
        <td>Full stack</td>
        <td>Builds React app and backend.  The latter serves static app files and API responses to end users.<br/> Although in many production deployments the static files would be served to a CDN instead.<br/>Having one server instead of two (one for frontend, another for backend) reduces the attack surface of the deployment, brings down its costs, complexity and delivers other benefits like CORS avoidance.</td>
        <td>Build a container using the supplied Dockerfile and deploy it to any cloud vendor that supports containers including:<ul><li>Google Cloud Run: Single click on the button located below in this section.  Then wait until the build finishes in the cloud and access a website. Fast :clock2: and simple build.</li><li>Heroku: Execute several commands from your Terminal and get a website running. Simple build but takes :clock5: a while. Free :coffee: deployment option.</li><li>Google Compute Engine: More complex :scroll: deployment with a series of commands to execute and without any software that needs to be installed.</li></ul></td>
    </tr>
    <tr>
      <td>Jamstack</td>
     <td>Builds the React app only. The build artifacts are served to end users by the webserver supplied by a Jamstack vendor.<br/>Since the demo project has no backend, the API calls go directly to the cloud service.<br/> In real life scenarios the API calls could target endpoints implemented by AWS API Gateway or similar infrastructure.</td>
      <td>Build the React app either in the cloud or locally:<ul><li>Cloudflare Pages: Provide just a few simple pieces of data using the configuration screen presented by Pages. Then get a website built and deployed in the cloud. Fast :clock2: and simple build with free :coffee: deployment option.</li><li>AWS S3: More complex :scroll: deployment. Build the website locally and copy build artifacts to a cloud bucket while completing a series of manual deployment steps.</li></ul></td>
      </tr>
    </table>
    Switching between the two options doesn’t require configuration changes though with Jamstack it could be easier (and in the spirit of Jamstack inspired simplicity) to have only one SPA named 'index'. This arrangement ensures the automatically generated HTML file is called `index.html`. It makes integration with some vendors more straightforward.

* CSS Handling. The following four CSS handling approaches can be used:

    <ul>
      <li>Plain CSS: Simple and performant with the burden to track name collisions created by multiple components using rules with similarly named class selectors.
      </li>
      <li>CSS Modules:  Performant with convenience of name collisions resolved automatically and drawback of possible rule repetition leading to an increase in size of the resulting stylesheet. Supports rule reuse via composition.
      </li>
      <li>LESS: Like Plain CSS but with extended CSS syntax and rich additional functionality.
      </li>
      <li>CSS-in-JS: Developer’s convenience with more flexible CSS adjusted if needed during its construction at run-time. The application logic that drives CSS adjustments (for example, driven by the shape of data received) can be sophisticated and challenging to be expressed via CSS created at build time. Overall this approach translates into self-contained and self-adjusting components, development speed and better codebase maintainability (especially when multiple developers or teams are involved). The advantages come at the price of possible rule repetition along with a performance penalty caused by dependency on script bundles download, parsing and execution. There are other, more subtle drawbacks mentioned later.
      </li>
    </ul>

    The solution allows to use each approach as a sole CSS handling technique or combine it with any or all of the remaining three approaches - with no configuration effort. More details are available under the [CSS Handling](https://github.com/winwiz1/crisp-react#css-handling) heading.

* Containerisation. Used to build and deploy full stack builds. A container acts as a mini operating system providing your code with the same run-time dependencies no matter where the container runs. One of the benefits of this approach is that your programs are less likely to break during deployments due to differences between your run-time environment and the one supplied by hosting provider. It makes a container (represented by the sequence of build instructions in [`Dockerfile`](https://github.com/winwiz1/crisp-react/blob/master/Dockerfile) to be a robust deployment vehicle.

    Another benefit is vendor lock-in avoidance: Many cloud vendors including AWS, Azure, GCP, Heroku and others accept containers.

    Yet another benefit is the simplicity of deployment. For example, a click on the button shown below will deploy a container on GCP whereas few simple commands provided under the [Heroku](https://github.com/winwiz1/crisp-react#heroku) heading will achieve the same for Heroku.

    Docker multi-staged build is used to ensure the backend run-time environment doesn't contain the client build-time dependencies e.g. `client/node_modules/`. It improves security and reduces container's storage footprint.

    - As a single-click container deployment option, you can build and deploy the container on Cloud Run. The prerequisites are to have a Google Cloud account with at least one project created and billing enabled.<br/>
[![Run on Google Cloud](./cloudrun.png)](https://deploy.cloud.run?git_repo=https://github.com/winwiz1/crisp-react)<br/>
The build will take a while due to free Cloud Shell using a free cloud VM with modest specs. After the build and deployment are finished you can click on the provided link and see the page rendered by the client.<br/><br/>
:heavy_exclamation_mark: It is highly recommended to either add a firewall protection to the created service or to delete it if the deployment was used as a demo/proof of concept. The explanation why this is needed can be found [there](https://github.com/winwiz1/crisp-react#cloud-run-considerations). Delete the service using the command:<br/>
`gcloud run services delete crisp-react --platform=managed --region=us-central1 --project=<project-name>`<br/>
It can be conveniently executed from the Cloud Shell session opened during the deployment. Update the `region` with the one chosen during the deployment and replace `<project-name>` with your project name. Alternatively delete the service using Cloud Run [Console](https://console.cloud.google.com/run).

* API. In the full stack build the backend communicates with a cloud service on behalf of clients and makes data available via an API endpoint. It's consumed by the clients. The Name Lookup API is used as a sample:
    ![API Screenshot](screenshots/api.png)

    The implementation provides reusable code, both client-side and backend, making it easier to switch to another API. In fact this approach has been taken by the sibling Crisp BigQuery repository created by cloning and renaming this solution - it uses Google BigQuery API instead.<br/>
This arrangement brings a security benefit: The clients running inside a browser in a non-trusted environment do not have credentials to access a cloud service that holds sensitive data. The backend runs in the trusted environment you control and does have the credentials.

* Seamless debugging. Debug a minified/obfuscated, compressed production bundle and put breakpoints in its TypeScript code using both VS Code and Chrome DevTools. Development build debugging: put breakpoints in the client and backend code and debug both simultaneously using a single instance of VS Code.

Back to the [README](https://github.com/winwiz1/crisp-react#project-highlights).

