/**
 * Created by pengwei on 2/23/16.
 */

module.exports = function(transport, config){
    switch(transport){
        case 'file':
            return require('./lib/file-logger')(config);
        case 'graylog':
            return require('./lib/graylog-logger')(config);
        default:
            return require('./lib/console-logger')(config);
    }
};