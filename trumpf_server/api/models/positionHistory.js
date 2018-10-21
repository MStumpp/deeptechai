
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
require('mongoose-long')(mongoose);

mongoose.Promise = global.Promise;

var SchemaTypes = mongoose.Schema.Types;
var Long = mongoose.Types.Long;

const PositionHistorySchema = new Schema({
	id: { type: Number, index: true },
	address: { type: SchemaTypes.Long, index: true },
	x: { type: Number, index: true },
	y: { type: Number, index: true },
 	z: { type: Number, index: true },
 	timestamp: { type: SchemaTypes.Long, index: true }
}, { collection: 'positionHistories' });

module.exports = mongoose.model('PositionHistories', PositionHistorySchema);
