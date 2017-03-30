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
let logger = require('ts-logger')(TRANSPORT, configObj);
logger.error(new Error('something is wrong'));
logger.info(1);
logger.debug('Number of retry attempt: 17');
logger.info({
    key1: 'value1',
    key2: 'value2'
})
```

You can pass in various types of things to log, the logger makes sure that what you passed in is transformed and adapted properly for the transport.

Here are the transports we support
* [graylog](#graylog)
* [console](#console)

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
    key1: 'value1'
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

#### Transport: `file`
This transport is NOT actively maintained, thus *NOT* recommended.

#### Logging feature: `throttle`
The throttled logger has a waiting time of 1 second by default
```
let logger = require('ts-logger')('console');
logger.throttle.error(new Error('something wrong'));
```

### Logging feature: `DEBUG_MODE`
In debug mode, console transport will also be used *in addition to* the chosen transport, if it was not console transport.




## Test
```
npm install -g mocha
mocha test/
```

## Reference
More documentation can be found at
* https://tetrascience.atlassian.net/wiki/display/TSD/ts-logger
* https://tetrascience.atlassian.net/wiki/display/TSD/Log+Levels
