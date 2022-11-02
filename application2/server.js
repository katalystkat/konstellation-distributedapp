
const otel = require('@opentelemetry/core')
const interceptor = require('./requestInterceptor');
const fetch = require('node-fetch');

const express = require("express");
const PORT = process.env.PORT || "3002";
const app = express();

// interceptor.instrumentTraffic();

app.get("/", async (req, res) => {

  return res.status(200).json('Route Completed');
});

app.get("/moveon", async (req, res)=> {
    console.log("\nReceived a Request in Endpoint: '/' @ " + getTimestamp())
    console.log("Headers are:")
    console.log(req.headers);

    try {
    //   const response = await fetch('http://localhost:3003/moveon')
    // // const response = await fetch('http://d2:3003/moveon') // UNComment for container build
    //   const data = await response.json();
    //   console.log(data);
      return res.status(200).json("Hello from Server 2")
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

/*
//this will write the trace data to testData.json
app.use("/v1/traces", (req, res) => {
	console.log(req.body);
	let data = req.body.resourceSpans;
	fs.appendFileSync(path.resolve(__dirname, './testData.json'),
	JSON.stringify(data) + '\n');
	res.status(200).send("v1/traces endpoint")
})
*/


// //this will send the trace data to middleware that will write the data to a db
// app.use("/v1/traces", serverController.writeToDB, (req, res, next) => {
// 	// var decoded = await protobuf.decode(Buffer.from(req.body));
//   	// console.log("this is the decoded req.body", decoded);
// 	return res.status(200).send('hello');
// })


app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: err },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj);
  return res.status(errorObj.status).json(errorObj.message);
});



app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});