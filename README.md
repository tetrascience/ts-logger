# ts-logger

ts-logger module integrates Graylog, file logger and console log together. Depending on the environment settings, the logger will be sending logs to different "transport".

## Installation
```sh
$ npm install tetrascience/ts-logger --save
```

## Usage
You have to first `require('ts-logger')(transport, config)` passing in the correct transport and config information.