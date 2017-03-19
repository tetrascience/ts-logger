'use strict';

const graygelf = require('graygelf');
const isObject = require('util').isObject;
const _ = require('lodash');

module.exports = function (config) {

    var graylog = graygelf({
        host: config.graylogHost || 'http://graylog',
        port: config.graylogPort || '12201'
    });

    var maxLogLevel = config.maxLogLevel || 7; // the highest possible level is 7

    function log(level) {
        return function (content) {
            // transform the content to fit with graylog

            if (level > maxLogLevel) return;
            var raw = {
                level: level
            };

            if (arguments.length === 1 && content instanceof Error) { //Handle error

                raw.short_message = content.message;
                raw.full_message = content.stack;

                Object.keys(content).forEach(function (key) {
                    if (key !== 'message' && key !== 'stack') {
                        raw['_' + key] = content[key];
                    }
                });

            } else if (arguments.length === 1 && isObject(content)) { //Handle object

                //short_message is required even if we only want to search by custom field
                raw.short_message = content.message || '_';
                raw.full_message = content.body;

                Object.keys(content).forEach(function (key) {
                    if (key !== 'message' && key !== 'body') {
                        raw['_' + key] = content[key];
                    }
                });
            } else { //Handle rest
                raw.short_message = content;
            }

            // send the graylog using gelf
            return graylog.raw(raw);
        }
    }

    return {
        emerg: log(0),
        alert: log(1),
        crit: log(2),
        error: log(3),
        warn: log(4),
        notice: log(5),
        info: log(6),
        log: log(6),
        debug: log(7)
    };
};

