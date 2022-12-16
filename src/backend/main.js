var express = require('express');
var app = express();
var axios = require('axios');

var account_id = 'YOUR ACCOUNT ID"'
var client_id = 'YOUR CLIENT ID"'
var client_secret = 'YOUR CLIENT SECRET"'

app.get('/createZoomMeeting', function (req, res) {
   //Generate Access Token
   var config = {
      method: 'post',
      url: 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + account_id + '&client_id=' + client_id + '&client_secret=' + client_secret
   };

   axios(config)
      .then(function (response) {
         console.log(JSON.stringify(response.data));
         //Create Zooom Meeting
         var data = JSON.stringify({
            "topic": "Zoom Meeting Created from TalkJS",
            "type": 2,
            "timezone": "Asia/Kolkata",
            "start_time": "2022-12-12T21:11:00Z",
            "agenda": "Zoom Meeting Created from TalkJS",
            "settings": {
               "join_before_host": true
            }
         });

         config = {
            method: 'post',
            url: 'https://api.zoom.us/v2/users/me/meetings',
            headers: {
               'Authorization': 'Bearer ' + response.data.access_token,
               'Content-Type': 'application/json'
            },
            data: data
         };

         axios(config)
            .then(function (response) {
               console.log(JSON.stringify(response.data));

               // Add CORS header
               res.header('Access-Control-Allow-Origin', '*');

               res.send(response.data)
            })
            .catch(function (error) {
               console.log(error);
            });
      })
      .catch(function (error) {
         console.log(error);
      });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})