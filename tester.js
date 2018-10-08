var sqlite3 = require('sqlite3');
var request = require('request');
var express = require('express');
var app = express();


var db = new sqlite3.Database('queries.database');
try{
    db.run("CREATE TABLE IF NOT EXISTS queries (id INTEGER PRIMARY KEY AUTOINCREMENT, q TEXT, url TEXT, name TEXT, created_at DATETIME)");
}catch(e){
    console.log("Database already exists, continue...");
}

app.use(express.static('public'));

app.get('/make-request', function (req, res) {
    console.log("Processing request:" + JSON.stringify(req.query));
    var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }else{
            if(error){
                res.sendBody(error);
            }
        }
    };
    var q = req.query.q;
    request({
        url: req.query.url,
        method: "GET",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        body: q
    }, callback);
});

app.get('/save-request', function(req, res) {
    console.log('Saving query...');
    var stmt = db.prepare("INSERT INTO queries (q,url,name,created_at) VALUES (?,?,?, DateTime('now'))");
    stmt.run(req.query.q, req.query.url, req.query.name);
    stmt.finalize();
    res.send({result:"OK"});
});

app.get('/remove-query', function(req, res) {
    console.log('Removing query from db...');
    var stmt = db.prepare("DELETE FROM queries WHERE id=?");
    stmt.run(req.query.id);
    stmt.finalize();
    res.send({result:"OK"});
});

app.get('/saved-queries/', function(req, res) {
    var ret = [];
    db.each("SELECT * FROM queries;",
        function (err, row) {
            if (err){
                return callback(err);
            }
            ret.push(row);
        },
        function (err, cntx) {
            res.send(ret);
        }
    );
});



app.listen(3200, function () {
    console.log('Elastic-Search Tester listening on port 3200...');
    console.log('Waiting for queries...');
});
