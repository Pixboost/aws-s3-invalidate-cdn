#!/usr/bin/env bash

set -e

echo "Deploying Infra..."
aws --endpoint-url=http://localhost:4581 cloudformation create-stack --stack-name infra --template-body file://infra/cf.yaml --region us-east-1

echo "Deploying Lambda..."
cd lambda
npm install
npm run build
cd ..
aws --endpoint-url=http://localhost:4572 s3 cp lambda/index.zip s3://code
aws --endpoint-url=http://localhost:4581 cloudformation create-stack --stack-name lambda --template-body file://lambda/cf.yaml --parameters ParameterKey=ImagesDomain,ParameterValue=http://pixboost:4545 ParameterKey=ApiSecret,ParameterValue=API-SECRET ParameterKey=ImageUrlPrefix,ParameterValue=https://site.com --region us-east-1

echo "Setting up S3 notifications"
aws --endpoint-url=http://localhost:4572 s3api put-bucket-notification-configuration --bucket images --notification-configuration file://infra/event-configuration.json
