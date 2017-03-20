# ts-logger

ts-logger module integrates Graylog, file logger and console log together. 
Based on the chosen transport, the logger will be sending logs to different destinations.

## Installation
```sh
$ npm install tetrascience/ts-logger --save
```

## Usage

### `graylog`
```
require('ts-logger')('graylog', {
   graylogHost: 'http://localhost',
   graylogPort: '12201'
})
```
 
### `console`
### `file` 


## Reference
More documentation can be found at https://tetrascience.atlassian.net/wiki/display/TSD/ts-logger
