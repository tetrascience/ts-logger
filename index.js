"use strict";

const _ = require('lodash');
const assert = require('assert');
const decorate = require('./util/decorate.js');
const graylogLogger = require('./lib/graylog-logger');
const fileLogger = require('./lib/file-logger');
const consoleLogger = require('./lib/console-logger');
const commonTypes = {
    WORKER_CRASH: 'worker-crash',
    WORKER_START: 'worker-start',
    QUEUE_STALLED: 'queue-stalled',
    SERVICE_CRASH: 'service-crash',
    SERVICE_START: 'service-start',
    QUEUE_ANALYSIS_FAILED: 'queue-analysis-failed',
    UNKNOWN: 'unknown',
};

let loggerFactory = function (transport, config) {
    let baseLogger;

    assert(!config || _.isObject(config), 'the second argument, if available, must be a config object');
    config = config || {};
    config.transport = transport;
    config.throttle_wait = config.throttle_wait || 1000;
    config.debug_mode = config.debug_mode || false;
    assert(_.isNumber(config.throttle_wait) && config.throttle_wait > 10,'config.throttle_wait should be a number, greater then 10ms');
    assert(_.isBoolean(config.debug_mode), 'config.debug_mode should be a boolean');

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
    if (transport !== 'console') {
        for (let method in baseLogger) {
            let originalFn = baseLogger[method];
            let decoratedFn = decorate(originalFn, config);

            // add console log to base logger in debug mode
            if (config.debug_mode) {
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
        throttledLogger[method] = _.throttle(baseLogger[method], config.throttle_wait || 1000, { trailing: false });
    }
    baseLogger.throttle = throttledLogger;

    // types
    baseLogger.types = commonTypes;
    baseLogger.commonTypes = commonTypes;

    baseLogger.extendTypes = (extraTypes)=>{
        baseLogger.types = _.assign(baseLogger.types, extraTypes);
    };

    baseLogger.listTypes = () => baseLogger.types;

    // attach the config object
    baseLogger.config = config;
    return baseLogger;
};


module.exports = loggerFactory;

