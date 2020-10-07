const http = require("http");
const express = require("express");
const { urlencoded } = require("body-parser");
const axios = require("axios");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();
app.use(urlencoded({ extended: false }));

app.post("/sms", (req, res) => {
  // Access the message body and the number it was sent from.
  console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);

  const url = `https://maker.ifttt.com/trigger/${process.env.IFTTT_EVENT_NAME}/with/key/${process.env.IFTTT_WEBHOOK_KEY}`;
  console.log(url);

  // post
  axios
    .post(url)
    .then((response) => {
      console.log(`statusCode: ${response.statusCode}`);
    })
    .catch((error) => {
      console.error(error);
    });

  // formulate message
  const twiml = new MessagingResponse();

  twiml.message(process.env.MESSAGE_RESPONSE);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

http.createServer(app).listen(8080, () => {
  console.log("Express server listening on port 1337");
});
