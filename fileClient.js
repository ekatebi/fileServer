#!/usr/bin/env node

var request = require('request');

var name = 'sample';
var ext = 'txt';
var url = 'http://localhost:18881/files';
var json = {name:name, ext:ext};
var apikey = 'some api key for my app';

request = request.defaults({headers:{apikey:apikey}});

// POST /files
request.post({url:url, json:json}, function(error, response) {

    console.log('POST /files', error||response.body);

    if(error || response.body.error) {
        return;
    }

    // GET /files/{fileId}
    var fileId = response.body.fileId;
    request.get({url:url+'/'+fileId}, function(error, response) {

        console.log('GET /files/{fileId}', error||response.body);

        if(error || response.body.error) {
            return;
        }
        
        // PUT /files/{fileId}
        var json = {data: 'sample file content\n'};
        request.put({url:url+'/'+fileId+'/data', json:json}, function(error, response) {

            console.log('PUT /files/{fileId}', error||response.body);
            
            if(error || response.body.error) {
                return;
            }

            // GET /files/{fileId}
            request.get({url:url+'/'+fileId+'/data'}, function(error, response) {
            console.log('GET /files/{fileId}', error||response.body);

            });
        });
    });
});
