const http = require("http");
const express = require("express");
const axios = require("axios");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();

app.post("/sms", (req, res) => {
  const url = `https://maker.ifttt.com/trigger/${process.env.IFTTT_EVENT_NAME}/with/key/${process.env.IFTTT_WEBHOOK_KEY}`;
  console.log({ url });
  //   // post
  //   axios
  //     .post(url)
  //     .then((res) => {
  //       console.log(`statusCode: ${res.statusCode}`);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });

  // formulate message
  const twiml = new MessagingResponse();

  twiml.message(process.env.MESSAGE_RESPONSE);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

http.createServer(app).listen(8080, () => {
  console.log("Express server listening on port 1337");
});
