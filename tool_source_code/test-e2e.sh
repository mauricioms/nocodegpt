#!/bin/sh

cd ./front-end
npm i
npm upgrade
npm audit fix --force
npm run test:e2e
cd ..
