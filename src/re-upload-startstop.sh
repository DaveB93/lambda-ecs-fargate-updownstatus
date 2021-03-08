#!/bin/bash
set -eu

BUCKETNAME="CHANGEME_BUCKET_NAME"
npm run build:backend
pushd startstop
zip ../startstop.js.zip main.js
popd
aws s3 cp startstop.js.zip s3://$BUCKETNAME
aws lambda update-function-code --function-name startstop --s3-bucket $BUCKETNAME --s3-key startstop.js.zip --publish
