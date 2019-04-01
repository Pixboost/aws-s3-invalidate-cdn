const http = require('http');
const https = require('https');

exports.handler = (event, context, callback) => {
  console.log('Running Lambda', event);

  const url = `${process.env.IMAGES_DOMAIN}/`;
  const client = url.indexOf('https://') === 0 ? https : http;

  client.get(url, res => {
    if (res.statusCode !== 200) {
      callback(`Expected response with code 200 but got ${res.statusCode}`);
      return;
    }

    callback(null, 'success');
  });
};