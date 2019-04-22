#!/usr/bin/env bash

RETRIES=0
MAX_RETRIES=10

until [[ `aws --endpoint-url=http://localhost:4581 cloudformation list-stacks --region us-east-1` ]]
do
    if [[ ${RETRIES} == ${MAX_RETRIES} ]]; then
        echo "Localstack is not ready, exiting"
        exit 1
    fi

    echo "Localstack is not ready, retrying... ${RETRIES}"
    RETRIES=$((RETRIES + 1))
    sleep 2
done

echo "Localstack is ready, let's start..."

set -e

echo "Deploying Infra..."
aws --endpoint-url=http://localhost:4581 cloudformation create-stack --stack-name infra --template-body file://infra/cf.yaml --region us-east-1

echo "Deploying Lambda..."
cd lambda
npm install
npm run localstack-zip-code
cd ..
aws --endpoint-url=http://localhost:4572 s3 cp lambda/index.zip s3://code
aws --endpoint-url=http://localhost:4581 cloudformation create-stack --stack-name lambda --template-body file://lambda/cf.localstack.yaml \
--parameters \
ParameterKey=ImagesDomain,ParameterValue=http://pixboost:4545 \
ParameterKey=ApiSecret,ParameterValue=API-SECRET \
ParameterKey=ImageUrlPrefix,ParameterValue=https://site.com \
ParameterKey=LambdaRole,ParameterValue=arn:aws:iam::123456:role/role-name \
ParameterKey=Debug,ParameterValue=1 \
--region us-east-1

echo "Setting up S3 notifications"
aws --endpoint-url=http://localhost:4572 s3api put-bucket-notification-configuration --bucket images --notification-configuration file://infra/event-configuration.json
