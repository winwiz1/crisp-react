# Used by Docker and Cloud Run

FROM node:12.18.1-slim as build
RUN apt-get update -qq && apt-get upgrade -qq \
  && apt-get clean autoclean && apt-get autoremove -y \
  && rm -rf \
    /var/lib/cache \
    /var/lib/log

WORKDIR /crisp-react/server
COPY --chown=node:node ./server/ .
RUN yarn
WORKDIR /crisp-react/client
COPY --chown=node:node ./client/ .
RUN yarn && yarn build:prod

FROM build as prod
WORKDIR /crisp-react/server
COPY --chown=node:node ./server/ .
COPY --from=build --chown=node:node /crisp-react/client/config/ /crisp-react/server/config/
RUN yarn && yarn compile

COPY --from=build --chown=node:node /crisp-react/client/dist/ /crisp-react/server/build/client/static/

EXPOSE 3000
ENV NODE_ENV=production
STOPSIGNAL SIGTERM

USER node
CMD ["node", "./build/srv/main.js"]
