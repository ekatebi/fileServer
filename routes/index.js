var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var fs = require('fs');

var db_fileId = {};
var db_file = {};
var path = __dirname+'/../uploads/';

/* post file name. */
router.post('/', function(req, res) {
    var body = req.body;
    if(!body.name || !body.ext) {
        res.send({error: 'bad file object'});
    } else {
        var file = body.name+'.'+body.ext;
        var fileId = db_file[file]; 
        if(!fileId) {
            fileId =  uuid.v4();
            db_file[file] = fileId;
            db_fileId[fileId] = file;
        }
        //console.log(db_file);
        //console.log(db_fileId);
        //console.log(path+file);
        fs.open(path+file, 'w', function(error) {
            if(error) {
                res.send({error: 'open failed!'});
            } else {
                res.send({fileId:fileId});
            }
        });
    }
});

router.get('/:fileId', function(req, res) {
    var fileId = req.params.fileId;
    var file = db_fileId[fileId]; 
    if(file) {
        file = file.split('.');
        res.send({name:file[0], ext:file[1]});
    } else {
        res.send({error: 'file not found'});
    }
});

router.put('/:fileId/data', function(req, res) {
    var body = req.body;
    var fileId = req.params.fileId;
    var file = db_fileId[fileId];
    if(file) {
        fs.writeFile(path+file, body.data, function(error) {
            if(error) {
                res.send({error:error});
            } else {
                res.send({file:file, action:'upload'});
            }
        });
    } else {
        res.send({error: 'file not found'});
    }
});

router.get('/:fileId/data', function(req, res) {
    var fileId = req.params.fileId;
    var file = db_fileId[fileId];
    if(file) {
        fs.readFile(path+file, function(error, data) {
            if(error) {
                res.send({error:error});
            } else {
                data = data.toString();
                res.send({file:file, action:'download', data:data});
            }
        });
    } else {
        res.send({error: 'file not found'});
    }
});


module.exports = router;
