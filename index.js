"use strict";

const _ = require('lodash');
const decorate = require('./util/decorate.js');
const graylogLogger = require('./lib/graylog-logger');
const fileLogger = require('./lib/file-logger');
const consoleLogger = require('./lib/console-logger');


let logger = function(transport, config){
    let tslogger;

    if (!_.isObject(config)){
        console.log('should pass a config object to logger');
        config = {};
    }

    switch(transport){
        case 'file':
            tslogger = fileLogger(config);
            break;
        case 'graylog':
            tslogger = graylogLogger(config);
            break;
        default:
            tslogger = consoleLogger(config);
    }

    for (let method in tslogger){
        let originalFn = tslogger[method];
        tslogger[method] = decorate(originalFn,config);
    }

    return tslogger;
};


module.exports = logger;

