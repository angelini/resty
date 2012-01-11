// Requires
var fs = require('fs');
var path = require('path');

// Utility Functions
function isInt(value){
  if((parseFloat(value, 10) == parseInt(value, 10)) && !isNaN(value)){
      return true;
  } else { 
      return false;
  } 
}

function send(res, response, code) {
  res.statusCode = code || 200;
  res.write(JSON.stringify(response));
  res.end();
}

function readResources(resource_dir) {
  var i = 0;
  var resources = {};
  var level = fs.readdirSync(resource_dir);

  for(; i < level.length; i++) {
    var stat = fs.statSync(path.join(resource_dir, level[i]));
    if(stat.isDirectory()) {
      resources[level[i]] = readResources(path.join(resource_dir, level[i]));
      resources[level[i]].main = require(path.join(resource_dir, level[i], level[i] + '.js'));
    }
  }

  return resources;
}

function writeResponse(err, obj, res) {
  if(err) {
    return send(res, err, 500);
  }

  send(res, obj);
}

// Middleware
module.exports = function resty(resource_dir) {
  var resources = readResources(resource_dir);

  return function(req, res, next) {
    var i = 0;
    var collection = true;
    var method = req.method.toLowerCase();
    var components = req.url.split('?')[0].split('/');
    components.shift();

    var context = {
      body: req.body,
      cookies: req.cookies,
      query: req.query
    };

    if(isInt(components[components.length - 1])) {
      collection = false;
    }

    var args = [];
    var resource = resources;
    for(; i < components.length; i += 2) {
      resource = resource[components[i]];

      if(!resource) {
        return send(res, {error: 'Resource Not Found'}, 404);
      }

      if((i + 2) >= components.length && collection) {
        break;
      }

      args.push(components[i + 1]);
    }

    if(collection) {
      resource = resource.main.Collection;
    } else {
      resource = resource.main.Resource;
    }

    if(!resource || !resource[method]) {
      return send(res, {error: 'Method Not Found'}, 404);
    }

    args.push(function(err, obj) {
      writeResponse(err, obj, res);
    });
    resource[method].apply(context, args);
  }
};
