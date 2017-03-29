# ts-logger

ts-logger module integrates Graylog, file logger and console log together. 
Based on the chosen transport, the logger will be sending logs to different destinations.

## Installation
```
npm install tetrascience/ts-logger --save
```

## Usage

### `throttle`
The throttle waiting time is 1 second.
```
let logger = require('ts-logger')('console');
logger.throttle.error(new Error('something wrong'));
```

### `graylog`
```
let logger = require('ts-logger')('graylog', {
   graylogHost: 'http://localhost',
   graylogPort: '12201'
})
```
 
### `console`
```
let logger = require('ts-logger')('console')
```


### `file`
This transport is NOT actively maintained, thus not recommended.


## Test
```
npm install -g mocha
mocha test/
```

## Reference
More documentation can be found at https://tetrascience.atlassian.net/wiki/display/TSD/ts-logger
