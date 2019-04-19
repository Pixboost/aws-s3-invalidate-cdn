const http = require('http');
const https = require('https');
const { URL } = require('url');
const util = require('util');

exports.handler = (event, context, callback) => {
  console.log('Running Lambda', event);

  const imagePrefix = process.env.IMAGE_URL_PREFIX;
  const apiSecret = process.env.API_SECRET;
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const url = new URL(`${process.env.IMAGES_DOMAIN}/api/2/img/${imagePrefix}/${srcKey}?auth=${apiSecret}`);
  const client = url.protocol === 'https:' ? https : http;

  const requestParams = {
    hostname: url.hostname,
    port: url.port,
    path: `${url.pathname}${url.search}`,
    method: 'DELETE'
  };
  console.log(`Invalidating ${util.inspect(requestParams)} using [${url.protocol}]`);
  const req = client.request(requestParams,
    res => {
      if (res.statusCode !== 200) {
        callback(`Expected response with code 200 but got ${res.statusCode}`);
        return;
      }

      callback(null, 'success');
    }
  );

  req.end();
};