#/bin/bash
git checkout package-lock.json
git pull
npm install
rm -Rf ./build/*
rm -Rf ./server/html
mkdir ./server/html
npm run build
cp -Rf ./build/* ./server/html
docker build --rm -f Dockerfile.staging -t dntroster-staging:temp .
for I in `docker ps -a | grep dntroster-staging | awk '{print $1}'`;do docker stop $I;docker rm -f $I;done
docker rmi dntroster-staging:latest 2> /dev/null
docker tag dntroster-staging:temp dntroster-staging:latest
docker rmi dntroster-staging:temp
docker run -d --network dntroster-staging --hostname dntroster \
	--env NODE_ENV=staging \
	--env CLIENT_SECRET=$CLIENT_SECRET \
	--env REDIRECT_URI="https://dntroster.com:3001" \
	--env JWT_KEY=$JWT_KEY \
	--restart=always -p 3001:3001 --name dntroster-staging dntroster-staging
