// create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var comments = [];

var server = http.createServer(function(req, res){
    console.log(req.method);
    var parseUrl = url.parse(req.url, true);
    var pathname = parseUrl.pathname;
    if(pathname === '/'){
        fs.readFile('./views/index.html', function(err, data){
            if(err){
                res.end('404 Not Found');
            }
            res.end(data);
        });
    }else if(pathname === '/post'){
        fs.readFile('./views/post.html', function(err, data){
            if(err){
                res.end('404 Not Found');
            }
            res.end(data);
        });
    }else if(pathname === '/comment'){
        if(req.method === 'POST'){
            var str = '';
            req.on('data', function(chunk){
                str += chunk;
            });

            req.on('end', function(){
                var comment = qs.parse(str);
                comments.push(comment);
                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
            });
        }
    }else if(pathname === '/comments'){
        var commentsStr = JSON.stringify(comments);
        res.end(commentsStr);
    }else if(pathname.indexOf('/public') === 0){
        fs.readFile('.' + pathname, function(err, data){
            res.end(data);
        });
    }else{
        res.end('404 Not Found');
    }
});

server.listen(3000, function(){
    console.log('Server is running on port 3000');
});