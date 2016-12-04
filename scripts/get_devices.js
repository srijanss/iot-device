'use strict';

/*
	Module dependencies
*/
var fs = require('fs');
const Args = require('command-line-args');
var Simulator = require('./simulator');

const optionsDefinitions = [
	{ name: 'listdevices', type: Boolean },
	{ name: 'listapps', type: Boolean },
	{ name: 'install', alias: 'i', type: Boolean },
	{ name: 'update', alias: 'u', type: Boolean },
	{ name: 'remove', alias: 'r', type: Boolean },
	{ name: 'deviceid', type: String },
	{ name: 'appid', type: String },
	{ name: 'applist', type: String },
	{ name: 'api', type: String },
];

const options = Args(optionsDefinitions);

if(options.api === 'device'){
	var conn_options = {
		'host': 'localhost',
		'port': 10010,
	}
	var simulate = new Simulator(conn_options);
} else {
	var simulate = new Simulator()
}

simulate.timer();
var api = options.api;

// if(options.api){
// 	var api = options.api;
// } else {
// 	var api = 'device';
// }
if (options.deviceid) {
	var param = options.deviceid;
	var deviceID = param;
}
if (options.appid) {
	var appID = options.appid;
}
// var payload = [{name: 'getTemperature', version: '2.1'}, {name: 'measureTemperature', version: '0.1'}];
var payload;
if(options.applist){
	fs.readFile(options.applist,  (err, data) => {
		if(err) {
			throw err;
		}
		payload = JSON.parse(data);
		if(options.install) {
			simulate.install_app(api, param, payload);
		} else if(options.update) {
			simulate.update_app(api, deviceID, appID, payload);
		} 
	});
}
if(options.listdevices){
	// console.log('DEBUG: listdevice ' + api);
	simulate.get_devices(api);
} else if(options.listapps) {
	simulate.get_device_apps(api, param);
}
if(options.remove) {
	simulate.delete_app(api, deviceID, appID);
}

