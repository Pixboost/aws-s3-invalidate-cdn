# aws-s3-invalidate-cdn
AWS Lambda that listens on S3 events and invalidates CDN cache.

## Running Locally

* `docker-compose up`
* `bash test-env.sh`

To test:

`aws --endpoint-url=http://localhost:4572 s3 cp image.png s3://images`

Get Logs: 

`aws --endpoint-url=http://localhost:4586 --region us-east-1 logs describe-log-groups`
`aws --endpoint-url=http://localhost:4586 --region us-east-1 logs describe-log-streams --log-group-name /aws/lambda/invalidate-cdn`
`aws --endpoint-url=http://localhost:4586 --region us-east-1 logs get-log-events --log-group-name /aws/lambda/invalidate-cdn --log-stream-name "+51178/02/10/[$LATEST]b27ee410"`