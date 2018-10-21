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

        let positions = yield PositionHistory.find({
            timestamp: {
                $gte: Long.fromString(start.toDate().getTime()+''),
                $lt: Long.fromString(end.toDate().getTime()+'')
            },
            address : Long.fromString(address)
        }).sort({ timestamp : 1 })

        let area = null
        if (positions && positions.length > 0) {
            let pos = positions[positions.length-1]
            area = Area.findOne({shape:
                {$geoIntersects:
                    {$geometry:{ "type" : "Point",
                        "coordinates" : [ pos[i].x, pos[i].y ] }
                    }
                }
            });
        }

        let areas = yield Area.find({})

        return {
            areas : areas,
            currentArea : area
        }
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

        console.log(start)
        console.log(end)
        console.log(address)

        let positions = yield PositionHistory.find({
            timestamp: {
                $gte: Long.fromString(start.toDate().getTime()+''),
                $lt: Long.fromString(end.toDate().getTime()+'')
            }
        }).sort({ timestamp : 1 })

        let sumWaitTime = 0
        let countWaitTime = 0
        let sumProcTime = 0
        let countProcTime = 0
        let prevArea = null

        for (var i=0; i<positions.length; i++) {

            if (i===0) {
                continue
            }

            let area = Area.findOne({shape:
                {$geoIntersects:
                    {$geometry:{ "type" : "Point",
                        "coordinates" : [ positions[i].x, positions[i].y ] }
                    }
                }
            });

            if (prevArea && area && area._id !== prevArea._id) {
                sumWaitTime += positions[i].timestamp - positions[i-1].timestamp
                countWaitTime += 1
            } else {
                sumProcTime += positions[i].timestamp - positions[i-1].timestamp
                countProcTime += 1
            }

            prevArea = area
        }

        let kpis = {
            avgWaitTime: (countWaitTime === 0 ? 0.0 : ((sumWaitTime / countWaitTime) / 1000).toFixed(2)),
            avgProcTime: (countProcTime === 0 ? 0.0 : ((sumProcTime / countProcTime) / 1000).toFixed(2))
        }

        return kpis
    })
}

