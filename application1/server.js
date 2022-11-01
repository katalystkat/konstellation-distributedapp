/* app.js */

import otel from '@opentelemetry/core'
import otelapi from '@opentelemetry/api'

const path = require('path');
const express = require("express");
const PORT = process.env.PORT || "3001";
const app = express();

// app.use(bodyParser.raw())
// app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.post("/moveon", (req, res)=> {
    console.log("Hit /moveon w/ POST @ " + getTimestamp())

    // create a new propogator
    const propogator = new otel.W3CTraceContextPropagator()

    // get the current context
    const context = otelapi.context;

    const headers = {}

    //injext the context into the headers
    propogator.inject(context, headers)

    // IN OTHER SERVICE, 
    const gotContext = propogator.extract();

    fetch('http://a2:3002', headers)
    .then(response => {
      if (response.status === 200) {
        return res.status(200).json('Route Completed');
      }
    })
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
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj);
  return res.status(errorObj.status).json(errorObj.message);
});



app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
