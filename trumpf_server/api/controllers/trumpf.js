'use strict';

var url = require('url');

var trumpf = require('./trumpfService');

module.exports.positions = function positions (req, res, next) {
  trumpf.positionsGet(req.swagger.params, res, next);
};

module.exports.addresses = function addresses (req, res, next) {
  trumpf.addressesGet(req.swagger.params, res, next);
};

module.exports.areas = function areas (req, res, next) {
  trumpf.areasGet(req.swagger.params, res, next);
};

module.exports.kpis = function kpis (req, res, next) {
  trumpf.kpisGet(req.swagger.params, res, next);
};
