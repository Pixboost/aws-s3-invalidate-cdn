#!/usr/bin/env bash

set -e

cd lambda
npm install
npm run build
cd ..

aws --endpoint-url=http://localhost:4581 cloudformation create-stack --stack-name infra --template-body file://infra.yaml --region us-east-1
aws --endpoint-url=http://localhost:4572 s3 cp lambda/index.zip s3://code
aws --endpoint-url=http://localhost:4581 cloudformation create-stack --stack-name infra --template-body file://lambda.yaml --parameters ParameterKey=ImagesDomain,ParameterValue=http://upstream ParameterKey=ApiSecret,ParameterValue=abc12345 --region us-east-1
aws --endpoint-url=http://localhost:4572 s3api put-bucket-notification-configuration --bucket images --notification-configuration file://event-configuration.json
