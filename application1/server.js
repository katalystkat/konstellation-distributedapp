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
    console.log("Hit /moveon w/ POST @ " + getTimestamp())

    // create a new propogator
    const propogator = new otel.W3CTraceContextPropagator()
    console.log("Propogator Created");

    // get the current context
    const context = otelapi.ROOT_CONTEXT;
    console.log("Got Context");

    const headers = {}

    //injext the context into the headers
    propogator.inject(context, headers)
    console.log("Injected");

    const response = await fetch('http://localhost:3002')
    const data = await response.json();
    console.log(data);

    // return res.status(200).json('Route Completed')

    
    // fetch('http://localhost:3002', headers)
    // .then(response => {
    //   if (response.status === 200) {
    //     return res.status(200).json('Route Completed');
    //   }
    // })
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
