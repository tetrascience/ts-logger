# ts-logger

ts-logger module integrates Graylog, file logger and console log together. 
Based on the chosen transport, the logger will be sending logs to different destinations. 
You can read more about the [transports](#transports) and [features](#features) in the following sections. 

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

You can pass in various types of things to log (object, error object, string, number), 
the logger makes sure that what you passed in is decorated with the proper meta data based from the config, 
transformed and adapted properly for the transport. 

Here are the transports we support
* [graylog](#transport-graylog)
* [console](#transport-console)

Beyond the transports, ts-logger also supports the following logging features
* [throttle](#feature-decoration)
* [debug mode]((#feature-debug-mode))
* [decoration](#feature-decoration)
* [type](#feature-type)


### Transports
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
logger.error(new Error('something bad'));
```
* Add the high level log to `message` and more detailed description to `body`. 
* If you pass in an error object, `error.message` will become the `message` and `error.stack` will become the `body`.
* If you pass a non-object (something like number or string), it will be converted into an object and the 
original input will be the `message` field. 
  
#### Transport: `console`
```
let logger = require('ts-logger')('console')
logger.info({
    key1: 'value1'
})
```
* If an object is passed in, require('util').inspect will be invoked (with default settings) to get a string representation of the object.
Read about util.inspect [here](https://nodejs.org/api/util.html#util_util_inspect_object_options).
* If you pass a non-object (something like number or string), it will be converted into an object and the 
original input will be the `message` field. 

#### Transport: `file`
This transport is NOT actively maintained, thus *NOT* recommended.


### Features

#### Feature: `throttle`
The throttled logger has a waiting time of 1 second by default
```
let logger = require('ts-logger')('console');
logger.throttle.error(new Error('something wrong'));
```
#### Feature: `debug mode`
In debug mode, console transport will also be used *in addition to* the chosen transport, if it was not console transport. 
The debug mode can be set using two methods:
* environmental variable: process.env.DEBUG_MODE
* `config.debug_mode`
```
let logger = require('ts-logger')('graylog', {
   graylogHost: 'http://localhost',
   graylogPort: '12201'
   debug_mode: true              // enable the debug mode using the config
});
logger.info('something to log');

```
#### Feature: `decoration`
Input to the logger will always be converted into an object. 
If the original input is an string or number, it will be converted into object. 
The original input becomes the `message` field of the object. 

The following fields in the config object will also be attached to object: 
* `service`, which is used to tag the name of the service, such as tspower,
* `NODE_ENV`, which is used to tag the application environment. 

#### Feature: `type`
It's highly recommended that you compile a list of well defined log types, such as device-heartbeat, service-restart and etc. 
It will help you to understand the distribution of your logs and quickly identify the logs of interest in your search. 
Refer to this [example](https://github.com/tetrascience/tsboss/blob/docker/utils/logger.js) from tspower.  

The logger provides a list of the common log types for you to use and you can access them from `logger.nativeTypes`. 
These are the common types of logs in the context of distributed system and microservice. 
```
let logger.nativeTypes = {
    WORKER_CRASH: 'worker-crash',
    WORKER_START: 'worker-start',
    QUEUE_STALLED: 'queue-stalled',
    SERVICE_CRASH: 'service-crash',
    SERVICE_START: 'service-start',
    QUEUE_ANALYSIS_FAILED: 'queue-analysis-failed',
    UNKNOWN: 'unknown'
};
```

The logger will automatically attach `type = types.UNKNOWN` to the log object if there is no type. 

You can take advantage of the native types like the following example and come up with your own logger:
```
let tsLogger = require('ts-logger');
let nativeTypes = tsLogger.nativeTypes;
let types = _.extend(nativeTypes, {
    SERVICE-SPECIFIC-BAHAVIOR-1: service-specific-behavior-1,
    SERVICE-SPECIFIC-BAHAVIOR-2: service-specific-behavior-2
});
let logger = tsLogger('graylog', config);
logger.types = logger.types;

// use one of the native types
logger.info({
    type: logger.types.WORKER_CRASH
    process_id: '897214'
});

// use the newly added type
let err = new Error('service specific error');
err.type = logger.types.SERVICE-SPECIFIC-BEHAVIOR-1;
logger.error(err);
```

## Test
```
npm install -g mocha
mocha test/
```

## Reference
More documentation can be found at
* https://tetrascience.atlassian.net/wiki/display/TSD/ts-logger
* https://tetrascience.atlassian.net/wiki/display/TSD/Log+Levels

## Todo: 
* use npm test for tests
* check array
* add logger.extendTypes as a function