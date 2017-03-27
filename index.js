"use strict";

const _ = require('lodash');
const assert = require('assert');
const decorate = require('./util/decorate.js');
const graylogLogger = require('./lib/graylog-logger');
const fileLogger = require('./lib/file-logger');
const consoleLogger = require('./lib/console-logger');


let logger = function(transport, config){
    let baseLogger;

    assert(!config || _.isObject(config), 'the second argument, if available, must be a config object');

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

    // add a debounced console log for debugging purpose
    baseLogger.debounce = _.debounce(console.log, 1000);

    return baseLogger;
};


module.exports = logger;

