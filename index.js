const http = require("http");
const express = require("express");
const axios = require("axios");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();

app.post("/sms", (req, res) => {
  // post
  axios
    .post(
      "https://maker.ifttt.com/trigger/twilio_message_received/with/key/cEfexBfvpjAknWme7uscR"
    )
    .then((res) => {
      console.log(`statusCode: ${res.statusCode}`);
    })
    .catch((error) => {
      console.error(error);
    });

  // formulate message
  const twiml = new MessagingResponse();

  twiml.message("The Robots are coming! Head for the hills!");

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

http.createServer(app).listen(8080, () => {
  console.log("Express server listening on port 1337");
});
