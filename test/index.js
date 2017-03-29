"use strict";

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');


describe('index', function () {

    beforeEach(function (done) {
        mockery.enable({useCleanCache: true});
        mockery.warnOnUnregistered(false);
        done();
    });

    afterEach(function (done) {
        mockery.resetCache();
        mockery.deregisterAll();
        done();
    });

    it('Should be able to decorate the base logger', function (done) {

        let decorateCount = 0;

        let decorateMock = function (fn) {
            decorateCount++;
            return fn;
        };

        let graylogMock = function () {
            return {
                info: function (arg) {
                    logCount++;
                    return arg;
                },
                debug: function (arg) {
                    return arg;
                }
            }
        };

        mockery.registerMock('./util/decorate.js', decorateMock);
        mockery.registerMock('./lib/graylog-logger', graylogMock);

        let logger = require('../index.js')('graylog', {});

        expect(decorateCount).to.equal(2);
        done();
    });

    it('Should be able to invoke the proper function in the transport', function (done) {

        let logCount = 0;
        let graylogMock = function () {
            return {
                info: function (arg) {
                    logCount++;
                    return arg;
                },
                debug: function (arg) {
                    logCount++;
                    return arg;
                }
            }
        };

        mockery.registerMock('./lib/graylog-logger', graylogMock);

        let logger = require('../index.js')('graylog', {});
        logger.info('test');
        logger.debug('test');
        expect(logCount).to.equal(2);
        done();
    });

    it('Should be log to console in debug_mode', function (done) {

        let consoleCount = 0;

        let decorateMock = function (fn) {
            return fn;
        };

        let graylogMock = function () {
            return {
                info: () => {
                },
                debug: () => {
                }
            }
        };

        let consoleMock = function () {
            return {
                info: () => {
                    consoleCount++;
                },
                debug: () => {
                    consoleCount++;
                }
            }
        };


        mockery.registerMock('./util/decorate.js', decorateMock);
        mockery.registerMock('./lib/graylog-logger', graylogMock);
        mockery.registerMock('./lib/console-logger', consoleMock);

        process.env.DEBUG_MODE = true;
        let logger = require('../index.js')('graylog', {});
        logger.info('test');
        logger.debug('test');
        expect(consoleCount).to.equal(2);
        process.env.DEBUG_MODE = false;
        done();
    });

    it('should be able to debounce the logging when transport is console', function(done){
        let consoleCount = 0;

        let consoleMock = function () {
            return {
                info: () => {
                    consoleCount++;
                }
            }
        };

        mockery.registerMock('./lib/console-logger', consoleMock);
        let logger = require('../')('console');

        let tick = setInterval(()=>{
            logger.throttle.info(Math.random());
        }, 10);

        setTimeout(()=>{
            clearInterval(tick);
        },800);

        setTimeout(()=>{
            expect(consoleCount).to.be.equal(1);
            done();
        },1500);
    });

    it('should be able to debounce the logging when transport is graylog', function(done){
        let consoleCount = 0;

        let graylogMock = function () {
            return {
                info: () => {
                    consoleCount++;
                }
            }
        };

        mockery.registerMock('./lib/graylog-logger', graylogMock);
        let logger = require('../')('graylog');

        let tick = setInterval(()=>{
            logger.throttle.info(Math.random());
        }, 10);

        setTimeout(()=>{
            clearInterval(tick);
        },800);

        setTimeout(()=>{
            expect(consoleCount).to.be.equal(1);
            done();
        },1500);
    });
});