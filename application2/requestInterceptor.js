const { ClientRequestInterceptor} = require('@mswjs/interceptors/lib/interceptors/ClientRequest');
const { XMLHttpRequestInterceptor } = require('@mswjs/interceptors/lib/interceptors/XMLHttpRequest');
const { FetchInterceptor } = require('@mswjs/interceptors/lib/interceptors/fetch');

const otel = require('@opentelemetry/core')
const otelapi = require('@opentelemetry/api')
const fetch = require('node-fetch')


function _instrumentHTTPTraffic() {

  const interceptor = new ClientRequestInterceptor();

  interceptor.apply();

  interceptor.on('request', async (request) => {

    const defaultHeaders = request.headers.all()
    const defaultUrl = request.url;

    // console.log("\nDEFAULT HEADERS:")
    // console.log(defaultHeaders)

  })
  
}

module.exports = {
  instrumentTraffic: _instrumentHTTPTraffic
}