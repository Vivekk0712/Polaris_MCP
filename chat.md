WARNING:  StatReload detected changes in 'supabase_client.py'. Reloading...
 INFO:     Shutting down
INFO:     Waiting for application shutdown.
INFO:     Application shutdown complete.
INFO:     Finished server process [11244]
INFO:     Started server process [3048]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:main:Fetching chat history for user pqjX1O3RYPU8ko6YugQVpb6g0lG2
INFO:httpx:HTTP Request: GET https://lcdsysezautmobgkjbrs.supabase.co/rest/v1/users?select=id&firebase_uid=eq.pqjX1O3RYPU8ko6YugQVpb6g0lG2 "HTTP/2 200 OK"
INFO:httpx:HTTP Request: POST https://lcdsysezautmobgkjbrs.supabase.co/rest/v1/users "HTTP/2 201 Created"
INFO:httpx:HTTP Request: GET https://lcdsysezautmobgkjbrs.supabase.co/rest/v1/messages?select=%2A&user_id=eq.3863604a-4a6b-4910-a00a-58b00767799c&order=created_at.desc&limit=10 "HTTP/2 200 OK"
INFO:     127.0.0.1:56089 - "GET /mcp/history?user_id=pqjX1O3RYPU8ko6YugQVpb6g0lG2 HTTP/1.1" 200 OK
INFO:main:Fetching chat history for user pqjX1O3RYPU8ko6YugQVpb6g0lG2
INFO:httpx:HTTP Request: GET https://lcdsysezautmobgkjbrs.supabase.co/rest/v1/users?select=id&firebase_uid=eq.pqjX1O3RYPU8ko6YugQVpb6g0lG2 "HTTP/2 200 OK"
INFO:httpx:HTTP Request: GET https://lcdsysezautmobgkjbrs.supabase.co/rest/v1/messages?select=%2A&user_id=eq.3863604a-4a6b-4910-a00a-58b00767799c&order=created_at.desc&limit=10 "HTTP/2 200 OK"
INFO:     127.0.0.1:56089 - "GET /mcp/history?user_id=pqjX1O3RYPU8ko6YugQVpb6g0lG2 HTTP/1.1" 200 OK
INFO:main:Received chat request from user pqjX1O3RYPU8ko6YugQVpb6g0lG2
INFO:httpx:HTTP Request: GET https://lcdsysezautmobgkjbrs.supabase.co/rest/v1/users?select=id&firebase_uid=eq.pqjX1O3RYPU8ko6YugQVpb6g0lG2 "HTTP/2 200 OK"
INFO:main:User profile: {'id': '3863604a-4a6b-4910-a00a-58b00767799c'}
INFO:httpx:HTTP Request: GET https://lcdsysezautmobgkjbrs.supabase.co/rest/v1/users?select=id&firebase_uid=eq.pqjX1O3RYPU8ko6YugQVpb6g0lG2 "HTTP/2 200 OK"
INFO:httpx:HTTP Request: GET https://lcdsysezautmobgkjbrs.supabase.co/rest/v1/messages?select=%2A&user_id=eq.3863604a-4a6b-4910-a00a-58b00767799c&order=created_at.desc&limit=10 "HTTP/2 200 OK"
INFO:main:Chat history: []
ERROR:main:Error processing chat request for user pqjX1O3RYPU8ko6YugQVpb6g0lG2: "Unable to determine the intended type of the `dict`. For `Content`, a 'parts' key is expected. For `Part`, either an 'inline_data' or a 'text' key is expected. For `Blob`, both 'mime_type' and 'data' keys are expected. However, the provided dictionary has the following keys: ['role', 'content']"
INFO:     127.0.0.1:56089 - "POST /mcp/query HTTP/1.1" 500 Internal Server Error


backend output:
Error forwarding chat to MCP server: AxiosError: Request failed with status code 500
    at settle (C:\Users\Dell\Auth_System\backend\node_modules\axios\dist\node\axios.cjs:2097:12)
    at IncomingMessage.handleStreamEnd (C:\Users\Dell\Auth_System\backend\node_modules\axios\dist\node\axios.cjs:3305:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (C:\Users\Dell\Auth_System\backend\node_modules\axios\dist\node\axios.cjs:4483:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async C:\Users\Dell\Auth_System\backend\src\routes\session.js:73:25 {
  code: 'ERR_BAD_RESPONSE',
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },
    adapter: [ 'xhr', 'http', 'fetch' ],
    transformRequest: [ [Function: transformRequest] ],
    transformResponse: [ [Function: transformResponse] ],
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    env: { FormData: [Function [FormData]], Blob: [class Blob] },
    validateStatus: [Function: validateStatus],
    headers: Object [AxiosHeaders] {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'User-Agent': 'axios/1.12.2',
      'Content-Length': '58',
      'Accept-Encoding': 'gzip, compress, deflate, br'
    },
    method: 'post',
    url: 'http://localhost:8000/mcp/query',
    data: '{"user_id":"pqjX1O3RYPU8ko6YugQVpb6g0lG2","message":"hii"}',
    allowAbsoluteUrls: true
  },
  request: <ref *1> ClientRequest {
    _events: [Object: null prototype] {
      abort: [Function (anonymous)],
      aborted: [Function (anonymous)],
      connect: [Function (anonymous)],
      error: [Function (anonymous)],
      socket: [Function (anonymous)],
      timeout: [Function (anonymous)],
      finish: [Function: requestOnFinish]
    },
    _eventsCount: 7,
    _maxListeners: undefined,
    outputData: [],
    outputSize: 0,
    writable: true,
    destroyed: true,
    _last: false,
    chunkedEncoding: false,
    shouldKeepAlive: true,
    maxRequestsOnConnectionReached: false,
    _defaultKeepAlive: true,
    useChunkedEncodingByDefault: true,
    sendDate: false,
    _removedConnection: false,
    _removedContLen: false,
    _removedTE: false,
    strictContentLength: false,
    _contentLength: '58',
    _hasBody: true,
    _trailer: '',
    finished: true,
    _headerSent: true,
    _closed: true,
    _header: 'POST /mcp/query HTTP/1.1\r\n' +
      'Accept: application/json, text/plain, */*\r\n' +
      'Content-Type: application/json\r\n' +
      'User-Agent: axios/1.12.2\r\n' +
      'Content-Length: 58\r\n' +
      'Accept-Encoding: gzip, compress, deflate, br\r\n' +
      'Host: localhost:8000\r\n' +
      'Connection: keep-alive\r\n' +
      '\r\n',
    _keepAliveTimeout: 0,
    _onPendingData: [Function: nop],
    agent: Agent {
      _events: [Object: null prototype],
      _eventsCount: 2,
      _maxListeners: undefined,
      defaultPort: 80,
      protocol: 'http:',
      options: [Object: null prototype],
      requests: [Object: null prototype] {},
      sockets: [Object: null prototype] {},
      freeSockets: [Object: null prototype],
      keepAliveMsecs: 1000,
      keepAlive: true,
      maxSockets: Infinity,
      maxFreeSockets: 256,
      scheduling: 'lifo',
      maxTotalSockets: Infinity,
      totalSocketCount: 1,
      [Symbol(shapeMode)]: false,
      [Symbol(kCapture)]: false
    },
    socketPath: undefined,
    method: 'POST',
    maxHeaderSize: undefined,
    insecureHTTPParser: undefined,
    joinDuplicateHeaders: undefined,
    path: '/mcp/query',
    _ended: true,
    res: IncomingMessage {
      _events: [Object],
      _readableState: [ReadableState],
      _maxListeners: undefined,
      socket: null,
      httpVersionMajor: 1,
      httpVersionMinor: 1,
      httpVersion: '1.1',
      complete: true,
      rawHeaders: [Array],
      rawTrailers: [],
      joinDuplicateHeaders: undefined,
      aborted: false,
      upgrade: false,
      url: '',
      method: null,
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      client: [Socket],
      _consuming: false,
      _dumped: false,
      req: [Circular *1],
      _eventsCount: 4,
      responseUrl: 'http://localhost:8000/mcp/query',
      redirects: [],
      [Symbol(shapeMode)]: true,
      [Symbol(kCapture)]: false,
      [Symbol(kHeaders)]: [Object],
      [Symbol(kHeadersCount)]: 8,
      [Symbol(kTrailers)]: null,
      [Symbol(kTrailersCount)]: 0
    },
    aborted: false,
    timeoutCb: null,
    upgradeOrConnect: false,
    parser: null,
    maxHeadersCount: null,
    reusedSocket: true,
    host: 'localhost',
    protocol: 'http:',
    _redirectable: Writable {
      _events: [Object],
      _writableState: [WritableState],
      _maxListeners: undefined,
      _options: [Object],
      _ended: true,
      _ending: true,
      _redirectCount: 0,
      _redirects: [],
      _requestBodyLength: 58,
      _requestBodyBuffers: [],
      _eventsCount: 3,
      _onNativeResponse: [Function (anonymous)],
      _currentRequest: [Circular *1],
      _currentUrl: 'http://localhost:8000/mcp/query',
      [Symbol(shapeMode)]: true,
      [Symbol(kCapture)]: false
    },
    [Symbol(shapeMode)]: false,
    [Symbol(kCapture)]: false,
    [Symbol(kBytesWritten)]: 0,
    [Symbol(kNeedDrain)]: false,
    [Symbol(corked)]: 0,
    [Symbol(kChunkedBuffer)]: [],
    [Symbol(kChunkedLength)]: 0,
    [Symbol(kSocket)]: Socket {
      connecting: false,
      _hadError: false,
      _parent: null,
      _host: 'localhost',
      _closeAfterHandlingError: false,
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: false,
      _maxListeners: undefined,
      _eventsCount: 6,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: '',
      server: null,
      _server: null,
      timeout: 5000,
      parser: null,
      _httpMessage: null,
      autoSelectFamilyAttemptedAddresses: [Array],
      [Symbol(async_id_symbol)]: -1,
      [Symbol(kHandle)]: [TCP],
      [Symbol(lastWriteQueueSize)]: 0,
      [Symbol(timeout)]: Timeout {
        _idleTimeout: 5000,
        _idlePrev: [TimersList],
        _idleNext: [Timeout],
        _idleStart: 657803,
        _onTimeout: [Function: bound ],
        _timerArgs: undefined,
        _repeat: null,
        _destroyed: false,
        [Symbol(refed)]: false,
        [Symbol(kHasPrimitive)]: false,
        [Symbol(asyncId)]: 1477,
        [Symbol(triggerId)]: 1475,
        [Symbol(kAsyncContextFrame)]: undefined
      },
      [Symbol(kBuffer)]: null,
      [Symbol(kBufferCb)]: null,
      [Symbol(kBufferGen)]: null,
      [Symbol(shapeMode)]: true,
      [Symbol(kCapture)]: false,
      [Symbol(kSetNoDelay)]: true,
      [Symbol(kSetKeepAlive)]: true,
      [Symbol(kSetKeepAliveInitialDelay)]: 1,
      [Symbol(kBytesRead)]: 0,
      [Symbol(kBytesWritten)]: 0
    },
    [Symbol(kOutHeaders)]: [Object: null prototype] {
      accept: [Array],
      'content-type': [Array],
      'user-agent': [Array],
      'content-length': [Array],
      'accept-encoding': [Array],
      host: [Array]
    },
    [Symbol(errored)]: null,
    [Symbol(kHighWaterMark)]: 16384,
    [Symbol(kRejectNonStandardBodyWrites)]: false,
    [Symbol(kUniqueHeaders)]: null
  },
  response: {
    status: 500,
    statusText: 'Internal Server Error',
    headers: Object [AxiosHeaders] {
      date: 'Fri, 10 Oct 2025 15:58:11 GMT',
      server: 'uvicorn',
      'content-length': '34',
      'content-type': 'application/json'
    },
    config: {
      transitional: [Object],
      adapter: [Array],
      transformRequest: [Array],
      transformResponse: [Array],
      timeout: 0,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      maxBodyLength: -1,
      env: [Object],
      validateStatus: [Function: validateStatus],
      headers: [Object [AxiosHeaders]],
      method: 'post',
      url: 'http://localhost:8000/mcp/query',
      data: '{"user_id":"pqjX1O3RYPU8ko6YugQVpb6g0lG2","message":"hii"}',
      allowAbsoluteUrls: true
    },
    request: <ref *1> ClientRequest {
      _events: [Object: null prototype],
      _eventsCount: 7,
      _maxListeners: undefined,
      outputData: [],
      outputSize: 0,
      writable: true,
      destroyed: true,
      _last: false,
      chunkedEncoding: false,
      shouldKeepAlive: true,
      maxRequestsOnConnectionReached: false,
      _defaultKeepAlive: true,
      useChunkedEncodingByDefault: true,
      sendDate: false,
      _removedConnection: false,
      _removedContLen: false,
      _removedTE: false,
      strictContentLength: false,
      _contentLength: '58',
      _hasBody: true,
      _trailer: '',
      finished: true,
      _headerSent: true,
      _closed: true,
      _header: 'POST /mcp/query HTTP/1.1\r\n' +
        'Accept: application/json, text/plain, */*\r\n' +
        'Content-Type: application/json\r\n' +
        'User-Agent: axios/1.12.2\r\n' +
        'Content-Length: 58\r\n' +
        'Accept-Encoding: gzip, compress, deflate, br\r\n' +
        'Host: localhost:8000\r\n' +
        'Connection: keep-alive\r\n' +
        '\r\n',
      _keepAliveTimeout: 0,
      _onPendingData: [Function: nop],
      agent: [Agent],
      socketPath: undefined,
      method: 'POST',
      maxHeaderSize: undefined,
      insecureHTTPParser: undefined,
      joinDuplicateHeaders: undefined,
      path: '/mcp/query',
      _ended: true,
      res: [IncomingMessage],
      aborted: false,
      timeoutCb: null,
      upgradeOrConnect: false,
      parser: null,
      maxHeadersCount: null,
      reusedSocket: true,
      host: 'localhost',
      protocol: 'http:',
      _redirectable: [Writable],
      [Symbol(shapeMode)]: false,
      [Symbol(kCapture)]: false,
      [Symbol(kBytesWritten)]: 0,
      [Symbol(kNeedDrain)]: false,
      [Symbol(corked)]: 0,
      [Symbol(kChunkedBuffer)]: [],
      [Symbol(kChunkedLength)]: 0,
      [Symbol(kSocket)]: [Socket],
      [Symbol(kOutHeaders)]: [Object: null prototype],
      [Symbol(errored)]: null,
      [Symbol(kHighWaterMark)]: 16384,
      [Symbol(kRejectNonStandardBodyWrites)]: false,
      [Symbol(kUniqueHeaders)]: null
    },
    data: { detail: 'Internal server error' }
  },
  status: 500