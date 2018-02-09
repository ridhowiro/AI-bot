'use strict';
const line = require('@line/bot-sdk');
const express = require('express');
var request = require("request");

// create LINE SDK config from env variables

const config = {
   channelAccessToken: a1WwYXDztrgn7ulesNsPqF3IPHNSKa6+QJ3s+lUOX7qWQLDHXwXU01SMXufSWcylYcB9A3zZupfcmjjMKJuzkuOvhpyXCwnFUF1IjAT1bxBWLz2G1uohEXIU/UQrqU769XioswMl8KsbmAUspi7M3QdB04t89/1O/w1cDnyilFU=,
   channelSecret: 22fede2888c781a10450474651b0a2aa
,
};

// create LINE SDK client

const client = new line.Client(config);


// create Express app
// about Express: https://expressjs.com/

const app = express();

// register a webhook handler with middleware

app.post('/webhook', line.middleware(config), (req, res) => {
   Promise
       .all(req.body.events.map(handleEvent))
       .then((result) => res.json(result));
});

// event handler

function handleEvent(event) {
   if (event.type !== 'message' || event.message.type !== 'text') {
       // ignore non-text-message event
       return Promise.resolve(null);
   }

   var options1 = {
       method: 'GET',
       url: 'http://api.asksusi.com/susi/chat.json',
       qs: {
           timezoneOffset: '-330',
           q: event.message.text
       }
   };

   request(options, function(error, response, body) {
       if (error) throw new Error(error);
       // answer fetched from susi
       //console.log(body);
       var ans = (JSON.parse(body)).answers[0].actions[0].expression;
       // create a echoing text message
       const answer = {
           type: 'text',
           text: ans
       };

       // use reply API

       return client.replyMessage(event.replyToken, answer);
   })
}

// listen on port

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`listening on ${port}`);
});