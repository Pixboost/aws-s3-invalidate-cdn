const assert = require('assert');
const AWS = require('aws-sdk');
const fs = require('fs');
const http = require('http');

describe('when uploading new file to S3 bucket', () => {
  let numberOfRequestsBefore = -1;
  let numberOfRequestsAfter = -1;
  let lastRequest;

  before(async () => {
    numberOfRequestsBefore = (await getJSON('http://localhost:2525/imposters/4545')).numberOfRequests;

    const s3 = new AWS.S3({
      endpoint: new AWS.Endpoint('http://localhost:4572'),
      s3ForcePathStyle: true
    });

    const uploadParams = {
      Bucket: 'images',
      Key: 'image.png',
      Body: fs.readFileSync('./image.png'),
    };

    await s3.putObject(uploadParams).promise();
  });

  describe('and waiting for Lambda to be executed asynchronously', () => {
    before((done) => {
      setTimeout(async () => {
        const imposter = await getJSON('http://localhost:2525/imposters/4545');
        numberOfRequestsAfter = imposter.numberOfRequests;
        lastRequest = imposter.requests.pop();

        done();
      }, 5000);
    });

    it('should make a request', () => {
      assert.strictEqual(numberOfRequestsAfter - numberOfRequestsBefore, 1);
    });

    it('should be a DELETE request', () => {
      assert.strictEqual(lastRequest.method, 'DELETE');
    });

    it('should has a right path', () => {
      assert.strictEqual(lastRequest.path, '/api/2/img/https://site.com/image.png');
    });

    it('should have API secret', () => {
      assert.strictEqual(lastRequest.query.auth, 'API-SECRET');
    });
  });
});

const getJSON = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      if (res.statusCode !== 200) {
        reject(`Can't get number of calls`);
      }

      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });
  });
};
