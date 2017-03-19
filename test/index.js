"use strict";

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');

mockery.enable();
mockery.warnOnUnregistered(false);


var decorateCount = 0;
var logCount = 0
var graylogMock = function(){
    return {
        info: function(arg) {logCount ++; return arg;},
        debug: function(arg) {logCount++; return arg;}
    }
};

var decorateMock = function(fn){
    decorateCount++;
    return fn;
};

mockery.registerMock('./lib/graylog-logger',graylogMock);
mockery.registerMock('./util/decorate.js', decorateMock);

var logger = require('../index.js')('graylog',{});

describe('index', function(){
    after(function(done){
        mockery.deregisterAll();
        done();
    });

    it('Should be able to log a message', function(done){

        expect(decorateCount).to.equal(2);
        logger.info('test');
        logger.debug('test');
        expect(logCount).to.equal(2);
        done();
    })
});