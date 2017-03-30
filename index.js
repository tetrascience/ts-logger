"use strict";

const _ = require('lodash');
const assert = require('assert');
const decorate = require('./util/decorate.js');
const graylogLogger = require('./lib/graylog-logger');
const fileLogger = require('./lib/file-logger');
const consoleLogger = require('./lib/console-logger');


let logger = function (transport, config) {
    let baseLogger;

    assert(!config || _.isObject(config), 'the second argument, if available, must be a config object');
    config = config || {};
    config.transport = transport;


    let consoleL = consoleLogger(config);

    // pick the base logger according to the transport
    // if there is no match, use console
    switch (transport) {
        case 'file':
            baseLogger = fileLogger(config);
            break;
        case 'graylog':
            baseLogger = graylogLogger(config);
            break;
        default:
            baseLogger = consoleL;
    }

    // 1. decorate the base logger if base logger is NOT console
    // 2. always print to console if the base logger is NOT console AND it's debug mode
    // todo: consider to use winston
    if (transport !== 'console') {
        for (let method in baseLogger) {
            let originalFn = baseLogger[method];
            let decoratedFn = decorate(originalFn, config);

            // add console log to base logger in debug mode
            if (process.env.DEBUG_MODE || config.debugMode) {
                baseLogger[method]  = function (arg) {
                    decoratedFn(arg);
                    consoleL[method](arg);
                }
            } else {
                baseLogger[method] = decoratedFn;
            }
        }
    }


    // add a throttle method to logger such that logs do not get too crazy
    // when there are hundreds of data points, the logs, if not throttled, can be overwhelming to digest/debug
    let throttledLogger = {};
    for (let method in baseLogger){
        throttledLogger[method] = _.throttle(baseLogger[method], 1000, { trailing: false });
    }
    baseLogger.throttle = throttledLogger;

    return baseLogger;
};


module.exports = logger;

