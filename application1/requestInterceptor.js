const { ClientRequestInterceptor } = require('@mswjs/interceptors/lib/interceptors/ClientRequest');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const otel = require('@opentelemetry/core')
const api = require('@opentelemetry/api')
const { AsyncHooksContextManager } = require("@opentelemetry/context-async-hooks");

const cache = {

}

async function _instrumentHTTPTraffic() {
  const interceptor = new ClientRequestInterceptor();

  interceptor.apply();

  interceptor.on('request', async (request) => {
    const defaultHeaders = request.headers.all()
    const defaultUrl = request.url;

    // console.log("\nDEFAULT HEADERS:")
    // console.log(defaultHeaders)

    if(!request.headers.all()['mock-id']) {
      const propogator = new otel.W3CTraceContextPropagator()
      const contextManager = new AsyncHooksContextManager();
      contextManager.enable();
      api.context.setGlobalContextManager(contextManager);

      const key = api.createContextKey("some key");
      const ctx = api.ROOT_CONTEXT;
      const ctx2 = ctx.setValue(key, "context 2");

      console.log("\nPROPOGATOR DEFINITION:")
      console.log(propogator)

      
      // const context = otelapi.trace.getSpanContext();
      console.log("\nCONTEXT VALUES:")
      console.log(ctx)
      console.log(ctx2);
      
      let mockHeaders = defaultHeaders
      // propogator.inject(context, mockHeaders);
      
      const requestMockId = uuidv4();
      cache[requestMockId] = true;
      
      mockHeaders = {
        ...mockHeaders,
        'mock-id': requestMockId
      }
      
      propogator.inject(ctx, mockHeaders)

      let mockResponse = await fetch(defaultUrl, {
        headers: mockHeaders
      })
      
      // console.log("\nMOCK RESPONSE HEADERS")
      // console.log(mockResponse.headers)
      
      // console.log("\nHEADERS OBJ VALUES")
      // console.log(headersObj);

      const mockResponseData = await mockResponse.json();
      const responseMockId = uuidv4();
      cache[responseMockId] = true;

      request.respondWith({
          status: mockResponse.status,
          statusText: mockResponse.statusText,
          headers: {
            ...defaultHeaders,
            'mock-id': responseMockId
          },
          body: JSON.stringify(mockResponseData)
        })
      }
  })
}

module.exports = {
  instrumentTraffic: _instrumentHTTPTraffic
}

























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