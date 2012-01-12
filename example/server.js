var connect = require('connect');
var resty = require('../resty');

var app = connect.createServer();
app.use(connect.query());
app.use(resty.middleware(__dirname + '/resources'));
app.listen(3000);

console.log('Server listening on port 3000');
