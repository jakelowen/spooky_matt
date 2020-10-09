const http = require("http");
const express = require("express");
const { urlencoded } = require("body-parser");
const session = require('express-session');
const axios = require("axios");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();
app.use(session({secret: process.env.SESSION_SECRET}));

app.use(urlencoded({ extended: false }));

app.post("/sms", (req, res) => {
  // Access the message body and the number it was sent from.
 
  // just for debugging 
  console.log(`Incoming message from ${req.body.From}: ${req.body.Body}. Session: ${JSON.stringify(req.session, null, 4)}`);
  

  // start message
  let messageText = ""
  // branch logic

  // this is the first time we've seen this convo (in the last 4 hours)
  if(req.session.firstResponseSent !== true) {
    messageText += "Hi! Thanks for checking out my display. While you're waiting for the magic to start, can you tell me if you're registered to vote? (Yes/No)"
    req.session.firstResponseSent = true // mark as initiated

    // turn on lights!
    // const url = `https://maker.ifttt.com/trigger/${process.env.IFTTT_EVENT_NAME}/with/key/${process.env.IFTTT_WEBHOOK_KEY}`;
    // console.log(url);

    // // post
    // axios
    //   .post(url)
    //   .then((response) => {
    //     console.log(`statusCode: ${response.statusCode}`);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });



  } else if (req.session.registered !== true) { // only here if initiated, but not yet answered registration question

    const body = req.body.Body.toUpperCase() // coerce body to uppercase

    if (body.includes("Y") || body.includes("YES")) { // check if body includes affirmation
      messageText += "Great! Thanks for being a voter like us! Election Day is coming fast, so please make your plan to vote at IWillVote.com."
    } else { // literally any other response 
      messageText += "If you're not registered or not sure, please visit IWillVote.com. You can register and make a plan to vote today."
    }
    req.session.registered = true // note that this question has been asked so we don't do so again

    // final message for everyone
    messageText += "\n\nIf you enjoy the display, can you do me a favor & help Theresa Greenfield defeat Joni Ernst? Chip in >> http://bit.ly/TGHallow \n\nHappy Halloween!"
  } else {
    // final message for everyone
    messageText += "\n\nIf you enjoy the display, can you do me a favor & help Theresa Greenfield defeat Joni Ernst? Chip in >> http://bit.ly/TGHallow \n\nHappy Halloween!"
  }


  // wrap it up
  const twiml = new MessagingResponse();
  twiml.message(messageText);
  // req.session = userSession
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

http.createServer(app).listen(8080, () => {
  console.log("Express server listening on port 8080");
});
