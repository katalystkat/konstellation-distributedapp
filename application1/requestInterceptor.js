const mswjs = require('@mswjs/interceptors')
const { ClientRequestInterceptor } = require('@mswjs/interceptors/lib/interceptors/ClientRequest');
const express = require("express");


function _instrumentHTTPTraffic() {
  const interceptor = new ClientRequestInterceptor();

  interceptor.apply();

  interceptor.on('request', async (request) => {

    console.log("REQUEST INTERCEPTED")

    let headers = request.headers.raw();
    console.log(headers);

    const url = request.url;
    const response = await fetch(url, {
      headers: {
        TraceID: 'd1bvhjkfhdsjkhkj4bvc42142-421u48291'
      }
    })


    request.respondWith({
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Maverick',
      })
    })
  })

  interceptor.on('response', (response) => {
    // console.log("RESPONSE INTERCEPTED")
    // let headers = response.headers.raw();
    // console.log(headers);

    // headers = {
    //   ...headers,
    //   'TraceID': '3215326437643543'
    // }
    // console.log(headers);

    


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
  })

}

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