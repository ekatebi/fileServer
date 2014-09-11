var should = require('should');
var assert = require('assert');

var request = require('request');
var url = 'http://localhost:18881/files';
var apikey = '1234';

request = request.defaults({headers:{apikey:apikey}});

describe('fileServer API test', function(){

    var fileInfo = {
        name: 'sample',
        ext: 'txt'};

    var fileData = {data: 'sample file content\n'};

    var fileId = '';

    it('should post file info', function(done){


        request
            .post({url: url, json: fileInfo}, function(err, res) {
                if (err) {
                    throw err;
                }

                assert.equal(res.statusCode, 200, 'bad code');
                assert.notEqual(res.body, null && '');

                fileId = res.body.fileId;

                assert.notEqual(fileId, null && '');

                done();

            });
    });

    it('should put file data', function(done){

        request
            .put({url: url + '/' + fileId + '/data', json: fileData}, function(err, res) {
                if (err) {
                    throw err;
                }

                assert.equal(res.statusCode, 200, 'bad code');

//                console.log(res.body);

                done();

            });
    });

    it('should get file info', function(done){

            request
                .get({url: url + '/' + fileId}, function(err, res) {

                    if (err) {
                        throw err;
                    }

                    assert.equal(res.statusCode, 200, 'bad code');
                    assert.notEqual(res.body, null && '');

                    var obj = JSON.parse(res.body);

//                    console.log(obj);
//                    console.log(fileInfo);


                    assert(obj.name == fileInfo.name);
                    assert(obj.ext == fileInfo.ext);

                    done();

                });

     });

    it('should get file data', function(done){

        request
            .get({url: url + '/' + fileId + '/data'}, function(err, res) {

                if (err) {
                    throw err;
                }

                assert.equal(res.statusCode, 200, 'bad code');
                assert.notEqual(res.body, null && '');

//                console.log(res.body);

                var obj = JSON.parse(res.body);

//                    console.log(obj);
//                    console.log(fileInfo);

                assert(obj.data == fileData.data);
                assert(obj.file == fileInfo.name + '.' + fileInfo.ext);

                done();

            });

    });

});
