/* app.js */
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
    console.log('moving on');
    fetch('http://a2:3002')
    .then(data => {
      return res.status(200).json('check your trace');
    })
    
    // res.redirect('k8s-default-fruiting-fa54ee7da7-1241372118.us-west-2.elb.amazonaws.com/a2');
})
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
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj);
  return res.status(errorObj.status).json(errorObj.message);
});



app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
