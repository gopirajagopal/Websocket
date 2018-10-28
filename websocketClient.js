//require 
var WebSocket = require("ws");
var request = require('request');

//constants
const  wsurl = "wss://va.msg.liveperson.net/ws_api/account/13350576/messaging/consumer?v=3";
const jwturl="https://va.idp.liveperson.net/api/account/13350576/signup";

//global variables.
var CreateResponse={};



function connect() {
    return new Promise(function(resolve, reject) {
 
 var  jwtHeader;
//get jwt
request.post(
    jwturl,
    { json: { key: 'value' } },
    function (error, response, body) {
      if(response.statusCode == 200) {
        var  jwtHeader = body.jwt;
        resolve(jwtHeader);
      }
      else{
        reject(new Error('statusCode=' + res.statusCode));
      }
    });
})
};




      //create a web socket
connect().then(function(jwtHeader){
 var header = {
              headers: {
                  "Authorization" : "JWT " + jwtHeader
              }
          };
    
  var ws = new WebSocket(wsurl, header);
      ws.addEventListener('error', function (err) {
      console.log("Error Creating Web Socket");
      console.log('========== EXIT =========');
      });
      createConversationId(ws);
      sendMessage(ws);     

}).catch(function(err) {
    console.log(err);
});


  //send a message to create a conversationid
function createConversationId(ws){
              ws.addEventListener('open', () => {
                ws.send('{"kind":"req","id":1,"type":"cm.ConsumerRequestConversation"}');
});
}


  //send message
function sendMessage(ws){
              ws.addEventListener('message', event => {
                console.log(`Message from server: ${event.data}`);
                CreateResponse = JSON.parse(event.data);
                    ws.send('{"kind":"req","id":2,"type":"ms.PublishEvent","body":{"dialogId":"'+CreateResponse.body.conversationId+'","event":{"type":"ContentEvent","contentType":"text/plain","message":"Test Message"}}}');

              ws.close(); 
 });
}

