@echo OFF
rem Uncomment the next two lines if running this file from empty directory
rem git clone https://github.com/winwiz1/crisp-react.git
rem cd crisp-react
setlocal
set HOST_PORT=3000
set HOST_ADDRESS=127.0.0.1
docker rmi crisp-react:localbuild 2>nul
docker build -t crisp-react:localbuild .
if ERRORLEVEL 1 echo Failed to build image && exit /b 2
docker stop crisp-react 2>nul
docker rm crisp-react 2>nul
docker run -d --name=crisp-react -p %HOST_PORT%:3000 crisp-react:localbuild
if ERRORLEVEL 1 echo Failed to run container && exit /b 1
echo Finished && docker ps -f name=crisp-react
rem Uncomment the next line if Chrome is installed
rem start chrome http://%HOST_ADDRESS%:%HOST_PORT%
