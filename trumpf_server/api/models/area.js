
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
require('mongoose-long')(mongoose);

mongoose.Promise = global.Promise;

var SchemaTypes = mongoose.Schema.Types;
var Long = mongoose.Types.Long;

const AreaSchema = new Schema({
	id: { type: Number, index: true },
	name: { type: String, index: true },
	shape: { type: Object }
}, { collection: 'areas' });

module.exports = mongoose.model('Area', AreaSchema);
