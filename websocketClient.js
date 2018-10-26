//require 
var WebSocket = require("ws");
var request = require('request');

//constants
const  wsurl = "wss://va.msg.liveperson.net/ws_api/account/13350576/messaging/consumer?v=3";

//global variables.
var CreateResponse={};

//get jwt
request.post(
    'https://va.idp.liveperson.net/api/account/13350576/signup',
    { json: { key: 'value' } },
    function (error, response, body) {
       if (!error && response.statusCode == 200) {
         
          var header = {
              headers: {
                  "Authorization" : "JWT " + body.jwt
              }
          };



//create a web socket
          var ws = new WebSocket(wsurl, header);
              ws.addEventListener('error', function (err) {
                console.log("Error Creating Web Socket");
                console.log('========== EXIT =========');
              });

//send a message to create a conversationid
              ws.addEventListener('open', () => {
                ws.send('{"kind":"req","id":1,"type":"cm.ConsumerRequestConversation"}');
              });
              
//send message
              ws.addEventListener('message', event => {
                console.log(`Message from server: ${event.data}`);
                CreateResponse = JSON.parse(event.data);
                    ws.send('{"kind":"req","id":2,"type":"ms.PublishEvent","body":{"dialogId":"'+CreateResponse.body.conversationId+'","event":{"type":"ContentEvent","contentType":"text/plain","message":"Test Message"}}}');

              ws.close(); 
              });
       }  

 else if (error) {
             console.error("error creating JWT");
                 }
              }

);
