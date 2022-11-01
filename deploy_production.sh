#/bin/bash
git checkout package-lock.json
git pull
npm install
rm -Rf ./build/*
rm -Rf ./server/html
mkdir ./server/html
npm run build
cp -Rf ./build/* ./server/html
docker build --rm -f Dockerfile.prod -t dntroster-prod:temp .
for I in `docker ps -a | grep dntroster-prod | awk '{print $1}'`;do docker stop $I;docker rm -f $I;done
docker rmi dntroster-prod:latest
docker tag dntroster-prod:temp dntroster-prod:latest
docker rmi dntroster-prod:temp
docker run -d --network dntroster --hostname dntroster \
	--env NODE_ENV=production \
	--env CLIENT_SECRET=$CLIENT_SECRET \
	--env REDIRECT_URI="https://dntroster.com" \
	--env JWT_KEY=$JWT_KEY \
	--restart=always -p 8443:8443 -p 8080:8080 --name dntroster-prod dntroster-prod
