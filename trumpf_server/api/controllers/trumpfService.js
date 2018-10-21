'use strict';

const api = require('../api/api');
const ApplicationError = require('../api/util').ApplicationError;

exports.positionsGet = function(args, res, next) {
    let inputData = {}
    inputData.address = args.address.value
    inputData.start = args.start.value
    inputData.end = args.end.value

    api.positions(inputData).then(result => {
        return res.json(result)
    }).catch(error => {
        console.log(error)
        res.status(400)
        if (error instanceof ApplicationError) {
            return res.json({ 'fehler' : error.message })
        } else {
            return res.json({ 'fehler' : 'interner fehler' })
        }
    })
}

exports.addressesGet = function(args, res, next) {
    api.addresses().then(result => {
        return res.json(result)
    }).catch(error => {
        console.log(error)
        res.status(400)
        if (error instanceof ApplicationError) {
            return res.json({ 'fehler' : error.message })
        } else {
            return res.json({ 'fehler' : 'interner fehler' })
        }
    })
}

exports.areasGet = function(args, res, next) {
    let inputData = {}
    inputData.address = args.address.value
    inputData.start = args.start.value
    inputData.end = args.end.value

    api.areas(inputData).then(result => {
        return res.json(result)
    }).catch(error => {
        console.log(error)
        res.status(400)
        if (error instanceof ApplicationError) {
            return res.json({ 'fehler' : error.message })
        } else {
            return res.json({ 'fehler' : 'interner fehler' })
        }
    })
}

exports.kpisGet = function(args, res, next) {
    let inputData = {}
    inputData.address = args.address.value
    inputData.start = args.start.value
    inputData.end = args.end.value

    api.kpis(inputData).then(result => {
        return res.json(result)
    }).catch(error => {
        console.log(error)
        res.status(400)
        if (error instanceof ApplicationError) {
            return res.json({ 'fehler' : error.message })
        } else {
            return res.json({ 'fehler' : 'interner fehler' })
        }
    })
}
