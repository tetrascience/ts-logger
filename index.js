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

    // decorate the base logger
    // always print to console
    // todo: consider to use winston
    // todo: disable console logging beyond debug mode
    if (transport !== 'console') {
        for (let method in baseLogger) {
            let originalFn = baseLogger[method];
            let decoratedFn = decorate(originalFn, config);

            // add console log to in debug mode
            if (process.env.DEBUG_MODE) {
                baseLogger[method]  = function (arg) {
                    decoratedFn(arg);
                    consoleL[method](arg);
                }
            } else {
                baseLogger[method] = decoratedFn;
            }
        }
    }


    // add a debounced method to logger to compress certain debug log / error
    baseLogger.debounce = _.debounce(baseLogger.info, 1000, { leading: true, trailing: false });

    return baseLogger;
};


module.exports = logger;

