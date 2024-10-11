#!/bin/sh

cd ./back-end
npm i
npm audit fix --force
npm run lint
cd ../front-end
npm i
npm audit fix --force
npm run lint
cd ..
 
 
