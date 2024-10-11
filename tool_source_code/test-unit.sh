#!/bin/sh

cd ./back-end
npm i
npm upgrade
npm audit fix --force
npm run test
cd ../front-end
npm i
npm upgrade
npm audit fix --force
npm run test:unit
cd ..
