'use strict';

var Simulator = require('./simulator');

var simulate = new Simulator();

var api = 'device';
var payload = {
	"location": "vaajakatu",
	"device_type": ["temperature", "speaker"]
};

// POST registers device RM , From device side
simulate.register_device(api, payload);