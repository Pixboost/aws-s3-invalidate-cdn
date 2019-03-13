#!/usr/bin/env bash

set -e

aws --endpoint-url=http://localhost:4572 s3api create-bucket --bucket images

aws --endpoint-url=http://localhost:4572 s3api create-bucket --bucket code
aws --endpoint-url=http://localhost:4572 s3 cp lambda/index.zip s3://code
aws --endpoint-url=http://localhost:4574 lambda create-function --function-name invalidate-cdn --runtime nodejs --code S3Bucket=code,S3Key=index.zip --role arn:aws:iam::123456:role/role-name --handler index.handler --region us-east-1
aws --endpoint-url=http://localhost:4572 s3api put-bucket-notification-configuration --bucket images --notification-configuration file://event-configuration.json
