const assert = require('assert');
const AWS = require('aws-sdk');
const fs = require('fs');

describe('test', () => {
  before((done) => {
    const s3 = new AWS.S3({
      endpoint: new AWS.Endpoint('http://localhost:4572'),
      s3ForcePathStyle: true
    });

    const uploadParams = {
      Bucket: 'images',
      Key: 'image.png',
      Body: fs.readFileSync('./image.png'),
    };
    s3.putObject(uploadParams, (err) => {
      if (err) {
        throw err;
      }

      done();
    });
  });

  it('1 is 1', () => {
    assert(1 === 1);
  });
});