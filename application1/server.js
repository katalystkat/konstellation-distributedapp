/* app.js */

const otel = require('@opentelemetry/core')
const otelapi = require('@opentelemetry/api')
const fetch = require('node-fetch')
const interceptor = require('./requestInterceptor')

const path = require('path');
const express = require("express");
const { request } = require('http');
const PORT = process.env.PORT || "3001";
const app = express();

interceptor.instrumentTraffic();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.post("/moveon", async (req, res)=> {
    console.log("\nReceived a Request in Endpoint: '/' @ " + getTimestamp())

    let url;
    if(process.env.NODE_ENV === 'development') url = 'http://localhost:3002/moveon';
    if(process.env.NODE_ENV === 'production') url = 'http://d2:3002/moveon';

    try {
      const response = await fetch(url) // Comment for container build
      const data = await response.json();

      console.log("\nRECEIVED RESPONSE:")
      console.log(data);

      console.log("\nRESPONSE HEADERS:")
      console.log(response.headers)

      res.status(200).json("Route Completed!")
    }
    catch (err) {
      console.log("Fetch Failed: " + err)
      res.status(500).json("Request Failed. Reason: " + err);
    }
})

function getTimestamp() {
  let ts = Date.now();

  let date_ob = new Date(ts);
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();

// prints date & time in YYYY-MM-DD format
  return (year + "-" + month + "-" + date + " at " + hours + ":" + minutes + ":" + seconds);
}

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: err},
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj);
  return res.status(errorObj.status).json(errorObj.message);
});



app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
