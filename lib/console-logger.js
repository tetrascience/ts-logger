/**
 * Created by pengwei on 2/23/16.
 */

var colors = require('colors/safe');
var inspect = require('util').inspect;
module.exports = function(){

    return {
        emerg:  function(msg) { console.error(colors.magenta.bold(processMessage(msg))); },
        alert:  function(msg) { console.error(colors.magenta(processMessage(msg))); },
        crit:   function(msg) { console.error(colors.red.bold(processMessage(msg))); },
        error:  function(msg) { console.error(colors.red(processMessage(msg))); },
        warn:   function(msg) { console.log(colors.yellow(processMessage(msg))); },
        notice: function(msg) { console.log(colors.green.bold(processMessage(msg))); },
        info:   function(msg) { console.log(colors.green(processMessage(msg))); },
        log:    function(msg) { console.log(colors.green(processMessage(msg))); },
        debug:  function(msg) { console.log(colors.gray(processMessage(msg))); }
    }
};

function processMessage(msg){
    if(msg.stack) console.error(colors.red(msg.stack));
    if(typeof msg == 'object') return inspect(msg);
    else return msg;
}