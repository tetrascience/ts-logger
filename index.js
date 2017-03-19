
const _ = require('lodash');
const NODE_ENV = process.env.NODE_ENV;
const types = {
    UNKNOWN: 'unknown'
};

const services = {
    UNKNOWN: 'unknown'
};



let logger = function(transport, config){
    let tslogger;

    if (!_.isObject(config)){
        console.log('should pass a config object to logger');
        config = {};
    }



    switch(transport){
        case 'file':
            tslogger = require('./lib/file-logger')(config);
        case 'graylog':
            tslogger = require('./lib/graylog-logger')(config);
        default:
            tslogger = require('./lib/console-logger')(config);
    }




    for (let method in tslogger){
        let originalFn = tslogger[method];
        tslogger[method] = decorate(originalFn);
    }


    return tslogger;
};


module.exports = logger;

