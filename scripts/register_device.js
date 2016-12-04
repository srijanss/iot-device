'use strict';

var Simulator = require('./simulator');

var options = {
	host: 'localhost',
	port: '10010',
}

var simulate = new Simulator(options);

simulate.timer();

var api = 'device';
var payload = {
	"location": "vaajakatu",
	"device_type": ["temperature", "speaker"]
};

// POST registers device RM , From device side
simulate.register_device(api, payload);
