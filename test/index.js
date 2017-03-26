"use strict";

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');


describe('index', function () {

    beforeEach(function (done) {
        mockery.enable({ useCleanCache: true });
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
    })
});