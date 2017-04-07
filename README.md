# ts-logger

ts-logger module integrates Graylog, file logger and console log together. 
Based on the chosen transport, the logger will be sending logs to different destinations.

## Installation
```
npm install tetrascience/ts-logger#docker --save
```

## Usage

### Overview
Pass in  the transport and a config object, such as

```
let config = {
    service: 'ts-microservice-1'
}
let logger = require('ts-logger')(TRANSPORT, configObj);
logger.error(new Error('something is wrong'));
logger.info(1);
logger.debug('Number of retry attempt: 17');
logger.info({
    key1: 'value1',
    key2: 'value2'
})
logger.info({
    message: 'something interesting',
    body: 'more detailed description'
})
```

You can pass in various types of things to log (object, error object, string, number), the logger makes sure that what you passed in is decorated with the proper meta based from the config, transformed and adapted properly for the transport. Check out the details here. 

Here are the transports we support
* [graylog](#transport-graylog)
* [console](#transport-console)

Here are the logging features we support
* throttle
* debug mode



#### Transport: `graylog`
```
let logger = require('ts-logger')('graylog', {
   graylogHost: 'http://localhost',
   graylogPort: '12201'
});
logger.info('something to log');
logger.debug({
    key1: 'value1',
    message: 'concise debug log',
    body: 'more detailed debug log'
})
```
 
#### Transport: `console`
```
let logger = require('ts-logger')('console')
logger.info({
    key1: 'value1'
})
```
If an object is passed in, require('util').inspect will be invoked (with default settings) to get a string representation of the object.
Read about util.inspect [here](https://nodejs.org/api/util.html#util_util_inspect_object_options).

#### Transport: `file`
This transport is NOT actively maintained, thus *NOT* recommended.

#### Logging feature: `throttle`
The throttled logger has a waiting time of 1 second by default
```
let logger = require('ts-logger')('console');
logger.throttle.error(new Error('something wrong'));
```
### Logging feature: `DEBUG_MODE`
In debug mode, console transport will also be used *in addition to* the chosen transport, if it was not console transport. The debug mode can be set using two methods:
* environmental variable: process.env.DEBUG_MODE
* `config.debug_mode`

### Logging feature: `decoration`
#### `decoration`
documents to be added. for now, take a look at utils/decorate.js

## Test
```
npm install -g mocha
mocha test/
```

## Reference
More documentation can be found at
* https://tetrascience.atlassian.net/wiki/display/TSD/ts-logger
* https://tetrascience.atlassian.net/wiki/display/TSD/Log+Levels
