const http = require('http');

exports.handler = (event, context, callback) => {
  console.log('Running Lambda', event);

  http.get({
    hostname: 'upstream',
    port: 80,
    path: '/'
  }, res => {
    if (res.statusCode !== 200) {
      callback(`Expected response with code 200 but got ${res.statusCode}`);
      return;
    }

    callback(null, 'success');
  });
};