"use strict";

const _ = require('lodash');
const decorate = require('./util/decorate.js');
const graylogLogger = require('./lib/graylog-logger');
const fileLogger = require('./lib/file-logger');
const consoleLogger = require('./lib/console-logger');


let logger = function(transport, config){
    let baseLogger;

    if (!_.isObject(config)){
        console.log('should pass a config object to logger');
        config = {};
    }

    // pick the base logger according to the transport
    switch(transport){
        case 'file':
            baseLogger = fileLogger(config);
            break;
        case 'graylog':
            baseLogger = graylogLogger(config);
            break;
        default:
            baseLogger = consoleLogger(config);
    }

    // decorate the base logger
    for (let method in baseLogger){
        let originalFn = baseLogger[method];
        baseLogger[method] = decorate(originalFn,config);
    }

    return baseLogger;
};


module.exports = logger;

