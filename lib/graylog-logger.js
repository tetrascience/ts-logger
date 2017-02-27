/**
 * Created by pengwei on 2/23/16.
 */

var graygelf = require('graygelf');
var isObject = require('util').isObject;

module.exports = function(config){
    var graylog = graygelf({
        host: config.graylogHost,
        port: config.graylogPort
    });
    var maxLogLevel = config.maxLogLevel;
    function log(level){
        return function(content){
            if(level > maxLogLevel) return;
            var raw = {
                level: level
            };

            if(arguments.length === 1 && content instanceof Error){ //Handle error
                raw.short_message = content.message;
                raw.full_message = content.stack;
                Object.keys(content).forEach(function(key){
                    raw['_' + key] = content[key];
                });
            }else if(arguments.length === 1 && isObject(content)){ //Handle object
                raw.short_message = content.message || '_'; //short_message is required even if we only want to search by custom field
                raw.full_message = content.body;
                Object.keys(content).forEach(function(key){
                    if(key !== 'message' && key !== 'body'){
                        raw['_' + key] = content[key];
                    }
                });
            }else{ //Handle rest
                raw.short_message = content;
            }

            graylog.raw(raw);
        }
    }

    return {
        emerg:  log(0),
        alert:  log(1),
        crit:   log(2),
        error:  log(3),
        warn:   log(4),
        notice: log(5),
        info:   log(6),
        log:    log(6),
        debug:  log(7)
    };
};
