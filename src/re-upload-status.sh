#!/bin/bash
set -eu

BUCKETNAME="CHANGEME_BUCKET_NAME"
npm run build:backendstatus
pushd serverstatus
zip ../serverstatus.js.zip main.js
popd
aws s3 cp serverstatus.js.zip s3://$BUCKETNAME
aws lambda update-function-code --function-name serverstatus --s3-bucket $BUCKETNAME --s3-key serverstatus.js.zip
