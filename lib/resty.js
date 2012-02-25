// Requires
var fs = require('fs');
var path = require('path');

// Utility Functions
var send = exports._send = function(res, response, code) {
  var headers = response.headers || {};

  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  res.writeHead(code, headers);
  res.write(JSON.stringify(response));
  res.end();
};

var readResources = exports._readResources = function(resource_dir) {
  var i = 0;
  var resources = {};
  var level = fs.readdirSync(resource_dir);

  for (; i < level.length; i++) {
    var index = level[i];
    var folder = path.join(resource_dir, index);
    var file = path.join(folder, index + '.js');
    var stat = fs.statSync(folder);

    if (stat.isDirectory()) {
      resources[index] = readResources(folder);
      resources[index]._main = require(file);
    }
  }

  return resources;
};

var writeResponse = exports._writeResponse = function(err, obj, res) {
  if (err) {
    return send(res, err, err.statusCode || 500);
  }

  send(res, obj, obj.statusCode || 200);
};

// Middleware
exports.middleware = function resty(resource_dir) {
  var resources = readResources(resource_dir);

  return function(req, res, next) {
    var i = 0;
    var collection = false;
    var method = req.method.toLowerCase();
    var components = req.url.split('?')[0].split('/');
    components.shift();

    // Makes '/example/' and '/example' equivalent
    if(components[components.length - 1] === '') {
      components.pop();
    }

    var context = {
      body: req.body,
      cookies: req.cookies,
      query: req.query,
      token: req.token
    };

    var args = [];
    var resource = resources;
    for (; i < components.length; i += 2) {
      resource = resource[components[i]];

      if (!resource) {
        return send(res, {
          error: 'Resource Not Found'
        },
        404);
      }

      if((i + 2) > components.length) {
        collection = true;
      } else {
        args.push(components[i + 1]);
      }
    }

    if (collection) {
      resource = resource._main.Collection;
    } else {
      resource = resource._main.Resource;
    }

    if (!resource || ! resource[method]) {
      return send(res, {
        error: 'Method Not Found'
      },
      404);
    }

    args.push(function(err, obj) {
      writeResponse(err, obj, res);
    });
    resource[method].apply(context, args);
  }
};