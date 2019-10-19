FROM node:12.8.1-slim as build
RUN apt-get update -y && apt-get upgrade -y

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

USER node
CMD ["node", "./build/srv/main.js"]
