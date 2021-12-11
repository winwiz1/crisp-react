#!/bin/sh
# Uncomment the next two lines if running this script from empty directory
# git clone https://github.com/winwiz1/crisp-react.git
# cd crisp-react
HOST_PORT=3000
HOST_ADDRESS=127.0.0.1
docker rmi crisp-react:localbuild 2>/dev/null
docker build -t crisp-react:localbuild . || { echo 'Failed to build image' ; exit 2; }
docker stop crisp-react 2>/dev/null
docker rm crisp-react 2>/dev/null
docker run -d --name=crisp-react -p ${HOST_PORT}:3000 crisp-react:localbuild || { echo 'Failed to run container' ; exit 1; }
echo 'Finished' && docker ps -f name=crisp-react
# xdg-open http://${HOST_ADDRESS}:${HOST_PORT} &
