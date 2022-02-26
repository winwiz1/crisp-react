FROM node:16.14.0-slim as client

WORKDIR /crisp-react/server
COPY ./server/ .
RUN yarn
WORKDIR /crisp-react/client
COPY ./client/ .
RUN yarn && yarn build:prod

FROM node:16.14.0-slim as server
WORKDIR /crisp-react/server
COPY ./server/ .
COPY --from=client /crisp-react/client/config/ /crisp-react/server/config/
RUN yarn && yarn compile
COPY --from=client /crisp-react/client/dist/ /crisp-react/server/build/client/static/

FROM node:16.14.0-slim as prod
RUN apt-get update -qq && apt-get upgrade -qq \
  && apt-get clean autoclean && apt-get autoremove -y \
  && rm -rf \
    /var/lib/cache \
    /var/lib/log
WORKDIR /crisp-react/server
COPY ./server/package.json ./server/yarn.lock ./
COPY --from=server /crisp-react/server/build/ ./build/
COPY --from=server /crisp-react/server/pub/ ./pub/
COPY --from=server /crisp-react/server/config/ ./config/
RUN yarn install --production=true --frozen-lockfile && yarn cache clean --all
RUN find /crisp-react -type d -not -perm 755 -exec chmod 755 {} \;
RUN find /crisp-react -type f -not -perm 644 -exec chmod 644 {} \;

EXPOSE 3000
ENV NODE_ENV=production
STOPSIGNAL SIGTERM

USER node
CMD ["node", "./build/srv/main.js"]
