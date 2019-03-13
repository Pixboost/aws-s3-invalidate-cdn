# aws-s3-invalidate-cdn
AWS Lambda that listens on S3 events and invalidates CDN cache.

## Running Locally

* `docker-compose up`
* `bash test-env.sh`

To test:

`aws --endpoint-url=http://localhost:4572 s3 cp image.png s3://images`
