var connect = require('connect');
var serveStatic = require('serve-static');

var port = 8081

connect().use(serveStatic('./dist')).listen(port, function(){
    console.log('Server running on ' + port + ' ...');
});
