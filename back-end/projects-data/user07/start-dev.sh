#!/bin/sh

while read v; do
	if [ -n "$v" ]; then
		cmd="export $v"
		echo $cmd
		eval "$cmd"
	fi
done <./.env

cd ./front-end/
npm i
npm run dev &

cd ../back-end/
npm i
npm run dev
