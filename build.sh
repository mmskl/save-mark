#!/usr/bin/env bash

mkdir -p publish
cp -fr content_script.js manifest.json popup.css popup.html popup.js icons publish
npm install web-ext
./node_modules/.bin/web-ext build -s publish
