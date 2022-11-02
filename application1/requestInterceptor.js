const mswjs = require('@mswjs/interceptors')
const { ClientRequestInterceptor } = require('@mswjs/interceptors/lib/interceptors/ClientRequest');
const express = require("express");
const fetch = require('node-fetch')
const otel = require('@opentelemetry/core')
const otelapi = require('@opentelemetry/api')


function _instrumentHTTPTraffic() {
  const interceptor = new ClientRequestInterceptor();

  interceptor.apply();

  interceptor.on('request', async (request) => {
    
    console.log('\n');
    console.log("~~ REQUEST INTERCEPTED ~~" + '\n')

    const propogator = new otel.W3CTraceContextPropagator();
    const context = otelapi.ROOT_CONTEXT;

    console.log("CURRENT PROPOGATOR")
    console.log(propogator);
    console.log('\n');
    
    console.log("CURRENT CONTEXT")
    console.log(context);
    console.log('\n');
    
    console.log("CURRENT CONTEXT VALUE")
    console.log(context.getValue());
    console.log('\n');

    // console.log("OTHER LOGS")
    // console.log("TraceID:")
    // console.log(context.TraceID);
    console.log("Trace:")
    console.log(otelapi.trace);
    // console.log("GetTracer:")
    // console.log(otelapi.trace.getTracer());
    // console.log("GetSpan:")
    // console.log(otelapi.trace.getSpan())
    // console.log("GetSpanContext:")
    // console.log(otelapi.trace.getSpanContext())
    // console.log("Trace Flags:")
    console.log(otelapi.TraceFlags);
    console.log('\n');
    
    const updatedHeaders = {
      ...request.headers.all(),
      TraceID: 'd1bvhjkfhdsjkhkj4bvc42142-421u48291'
    }

    propogator.inject(context, updatedHeaders);

    if(!request.headers.all()['trace-id']) {
        const url = request.url;
        const response = await fetch(url, {
          headers: updatedHeaders
      })
      // request.respondWith({
      //   status: request.headers.all(),
      //   statusText: response.statusText,
      //   headers: {
      //     ...response.headers,
      //     'trace-id': 'd1bvhjkfhdsjkhkj4bvc42142-421u48291'
      //   },
      //   body: response.body,
      // })
    }


  }
)}



























    // request.respondWith({
    //   status: response.status,
    //   statusText: response.statusText,
    //   headers: response.headers,
    //   body: response.body,
    // })

    // request.respondWith({
    //   status: 200,
    //   statusText: 'OK',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     firstName: 'John',
    //     lastName: 'Maverick',
    //   })
    // })
  // })

  // interceptor.on('response', (response) => {
  //   // console.log("RESPONSE INTERCEPTED")
  //   // let headers = response.headers.raw();
  //   // console.log(headers);

  //   // headers = {
  //   //   ...headers,
  //   //   'TraceID': '3215326437643543'
  //   // }
  //   // console.log(headers);

    


  //   // request.respondWith({
  //   //   status: 200,
  //   //   statusText: 'OK',
  //   //   headers: {
  //   //     'Content-Type': 'application/json',
  //   //   },
  //   //   body: JSON.stringify({
  //   //     firstName: 'John',
  //   //     lastName: 'Maverick',
  //   //   })
  //   // })
  // })

// }

// function _instrumentHTTPTraffic() {
//   const interceptor = createInterceptor({
//     resolver: () => {}, // Required even if not used
//     modules: [interceptXMLHttpRequest, interceptClientRequest],
//  });

//  interceptor.on("request", _handleHttpRequest);

//  interceptor.on("response", _handleHttpResponse);

//  interceptor.apply();
// }

// function _handleHttpRequest(request)  {
//  const url = request.url.toString();
//  const method = String(request.method);
//  const headers = request.headers.raw();

//  request.setHeader('example', 'value')

//  const requestEvent= {
//     headers,
//     method,
//     url: request.url.toString(),
//     body: request.body,
//  };


//  // Intentionally not waiting for a response to avoid adding any latency with this instrumentation
//  doSomethingWithRequest(requestEvent);
// }

// function _handleHttpResponse(request, response) {
//  const url = request.url.toString();
//  const headers = request.headers.raw();


//  const responseEvent = {
//     url: request.url.toString(),
//     method: request.method,
//     body: response.body,
//     headers: response.headers.raw(),
//     statusCode: response.status,
//  };

//  // Intentionally not waiting for a response to avoid adding any latency with this instrumentation
//  doSomethingWithResponse(responseEvent);
// }

module.exports = {
  instrumentTraffic: _instrumentHTTPTraffic
}