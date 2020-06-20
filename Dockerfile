# Used by Docker and Cloud Run

FROM node:12.18.1-slim as build
RUN apt-get update -y && apt-get upgrade -y

WORKDIR /crisp-react/server
COPY --chown=node:node ./server/ .
RUN yarn
WORKDIR /crisp-react/client
COPY --chown=node:node ./client/ .

# Development build with uncompressed and not minified bundle - slow
# Comment out next line when Google fixes issuetracker.google.com/issues/147185337
RUN yarn && yarn build

# Production build with compressed and minified bundle - fast
# Uncomment next line when Google fixes the above bug
#RUN yarn && yarn build:prod

FROM build as prod

WORKDIR /crisp-react/server
COPY --chown=node:node ./server/ .
COPY --from=build --chown=node:node /crisp-react/client/config/ /crisp-react/server/config/
RUN yarn && yarn compile

COPY --from=build --chown=node:node /crisp-react/client/dist/ /crisp-react/server/build/client/static/

EXPOSE 3000
ENV NODE_ENV=production

USER node
CMD ["node", "./build/srv/main.js"]
