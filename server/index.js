const express = require("express");
const request = require("request");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

const CAMERA_IP = "Your camera IP";

var rpc = require("node-json-rpc");

app.use(cors());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get("/express_backend", (req, res) => {
  console.log("request");
  res.send({
    express: "PROXY CONNECTED TO REACT"
  });
});

var options = {
  port: 8080,
  host: CAMERA_IP,
  path: "/sony/camera",
  strict: true
};

// Create a server object with options
var client = new rpc.Client(options);

// to receive json objects from app
app.use(express.json());

app.post("/RPC", (req, res) => {
  console.log("fetching RPC ...");
  console.log(req.body);

  // use the state.request to determine the request message
  client.call(req.body, function(err, rpcResponse) {
    if (err) {
      res.send(err);
    } else {
      res.send(rpcResponse);
    }
  });
});

app.get("/liveview", (req, res) => {
  console.log("fetching liveview ...");

  const options = {
    url: CAMERA_IP + ":8080/liveview/liveviewstream",
    //CORS thangs
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    }
  };

  let packetBuffer = new Buffer(0); //create buffer for packets
  var COMMON_HEADER_SIZE = 8;
  var PAYLOAD_HEADER_SIZE = 128;

  request
    .get(options)
    .on("error", function(err) {
      console.log(err);
    })
    .on("data", function(chunk) {
      packetBuffer = Buffer.concat([packetBuffer, chunk]);

      // <Buffer 24 35 68 79>.toString == "$5hy"
      if (packetBuffer.indexOf("$5hy") > 0) {
        packetBuffer = packetBuffer.slice(
          packetBuffer.indexOf("$5hy") - COMMON_HEADER_SIZE
        );

        let commonHeader = packetBuffer.slice(0, COMMON_HEADER_SIZE);
        let payloadHeader = packetBuffer.slice(
          COMMON_HEADER_SIZE,
          COMMON_HEADER_SIZE + PAYLOAD_HEADER_SIZE
        );

        let payloadType = commonHeader[1];
        let frameNr = commonHeader[2] * 16 + commonHeader[3];
        let jpgSizeBits = payloadHeader.slice(4, 7);

        // left bitshift, bitwise OR the 3bytes
        // *16 because data is in hexadecimal
        // not 100% sure if this is correct..
        let jpegSize =
          jpgSizeBits[0] * 16 * 16 * 16 +
          jpgSizeBits[1] * 16 * 16 +
          jpgSizeBits[2] * 16;

        // check if the current buffer contains all the data for one jpg
        if (
          jpegSize <=
          packetBuffer.length - COMMON_HEADER_SIZE - PAYLOAD_HEADER_SIZE
        ) {
          let jpgData = packetBuffer.slice(
            COMMON_HEADER_SIZE + PAYLOAD_HEADER_SIZE,
            COMMON_HEADER_SIZE + PAYLOAD_HEADER_SIZE + jpegSize
          );

          // in case the payload is an image
          if (payloadType == 1) {
            res.write(jpgData);
            console.log("image;  frame:", frameNr, "payload:", payloadType);
          } else {
            console.log("no image;  frame:", frameNr, "payload:", payloadType);
          }

          //remove the send image from buffer
          packetBuffer = packetBuffer.slice(
            COMMON_HEADER_SIZE + PAYLOAD_HEADER_SIZE + jpegSize
          );
        }
      }
    })
    .on("end", () => {
      res.end();
    });
});
