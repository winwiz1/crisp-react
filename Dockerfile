# Used by Docker and Cloud Run

FROM node:14.17.4-slim as build

WORKDIR /crisp-react/server
COPY ./server/ .
RUN yarn
WORKDIR /crisp-react/client
COPY ./client/ .
RUN yarn && yarn build:prod

FROM node:14.17.4-slim as prod

RUN apt-get update -qq && apt-get upgrade -qq \
  && apt-get clean autoclean && apt-get autoremove -y \
  && rm -rf \
    /var/lib/cache \
    /var/lib/log

WORKDIR /crisp-react/server
COPY ./server/ .
COPY --from=build /crisp-react/client/config/ /crisp-react/server/config/
RUN yarn && yarn compile

COPY --from=build /crisp-react/client/dist/ /crisp-react/server/build/client/static/
RUN find /crisp-react -type d -exec chmod 755 {} \;
RUN find /crisp-react -type f -exec chmod 644 {} \;

EXPOSE 3000
ENV NODE_ENV=production
STOPSIGNAL SIGTERM

USER node
CMD ["node", "./build/srv/main.js"]
