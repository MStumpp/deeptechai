'use strict';

const uuidv1 = require('uuid/v1')

const Moment = require('moment')
const extendMoment = require('moment-range').extendMoment
const moment = extendMoment(Moment)

const _ = require('lodash')
const co = require('co')
const assert = require('assert')

const PositionHistory = require('../models/positionHistory');
const Area = require('../models/area');

const util = require('./util')
const ApplicationError = util.ApplicationError

const mongoose = require('mongoose');
var Long = mongoose.Types.Long;

module.exports.positions = function(inputData) {
    return co(function* () {

        if (!inputData.address) {
            // log error
            return yield Promise.reject(new ApplicationError('address fehlt!'))
        }

        let address = inputData.address
        let start = inputData.start ? inputData.start : null // millisec, 13 char
        let end = inputData.end ? inputData.end : null // millisec, 13 char

        start = start ? moment(new Date(start)).utc() : moment().utc().add(-24, 'hours')
        end = end ? moment(new Date(end)).utc() : moment().utc()

        let positions = yield PositionHistory.find({
            timestamp: {
                $gte: Long.fromString(start.toDate().getTime()+''),
                $lt: Long.fromString(end.toDate().getTime()+'')
            },
            address : Long.fromString(address)
        }).sort({ timestamp : 1 })

        start = start ? moment(new Date(start)).utc() : moment().utc().add(-24, 'hours')
        end = end ? moment(new Date(end)).utc() : moment().utc()

        let response = {
            positions: positions
        }

        return response
    })
}

module.exports.addresses = function() {
    return co(function* () {

        let addresses = yield PositionHistory.find({}).distinct('address')

        return addresses
    })
}

module.exports.areas = function(inputData) {
    return co(function* () {

        if (!inputData.address) {
            // log error
            return yield Promise.reject(new ApplicationError('address fehlt!'))
        }

        let address = inputData.address
        let start = inputData.start ? inputData.start : null // millisec, 13 char
        let end = inputData.end ? inputData.end : null // millisec, 13 char

        start = start ? moment(new Date(start)).utc() : moment().utc().add(-24, 'hours')
        end = end ? moment(new Date(end)).utc() : moment().utc()

        let areas = yield Area.find({})

        return areas
    })
}

module.exports.kpis = function(inputData) {
    return co(function* () {

        if (!inputData.address) {
            // log error
            return yield Promise.reject(new ApplicationError('address fehlt!'))
        }

        let address = inputData.address
        let start = inputData.start ? inputData.start : null // millisec, 13 char
        let end = inputData.end ? inputData.end : null // millisec, 13 char

        start = start ? moment(new Date(start)).utc() : moment().utc().add(-24, 'hours')
        end = end ? moment(new Date(end)).utc() : moment().utc()

        let kpis = {
            avgWaitTime: 12.34,
            avgProcTime: 45.45
        }

        return kpis
    })
}

