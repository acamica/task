#/bin/bash
npm version prerelease --git-tag-version=false --preid=`git rev-parse --short HEAD`
npm run publish-lib
