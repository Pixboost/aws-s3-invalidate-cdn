const assert = require('assert');
const AWS = require('aws-sdk');
const fs = require('fs');

describe('test', () => {
  before((done) => {
    const s3 = AWS.S3({
      endpoint: 'http://localstack:4572'
    });

    const uploadParams = {
      Bucket: 'images',
      Key: 'image.png',
      Body: fs.createReadStream('image.png')
    };
    s3.upload(uploadParams, (err) => {
      if (!err) {
        throw err;
      }

      done();
    });
  });

  it('1 is 1', () => {
    assert(1 === 1);
  });
});