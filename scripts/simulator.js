'use strict';

/* 
	Module Dependencies
*/
var events = require('events');
var rest = require('restler');
var inherits = require('inherits');


var defaultOptions = {
	host: 'localhost',
	port: '10011',
}


/* 
	Simulator Constructor
*/

function Simulator(options){
	if(!options){
		this.options = defaultOptions;
	} else {
		this.options = options;
	}
	this.URI = 'http://' + this.options.host + ':' + this.options.port + '/';
}
inherits(Simulator, events.EventEmitter);

/* 
	@api private

*/

Simulator.prototype.get = function(api) {
	var that = this;
	rest.get(this.URI + api).on('200', result => {
		that.RESPONSE = result;
		console.log(result);
		that.emit('get_success');
		// console.log(that.DEVICES);
	});
}

Simulator.prototype.post = function(api, payload) {
	var that = this;
	rest.postJson(this.URI + api, payload).on('complete', result => {
		console.log(result);
		if(result["imageid"]) {
			that.IMAGEID = result["imageid"];
			that.emit('appinstalled');
		} else if(result["success"]){
			that.emit('appdeleted');
		} else{
			that.emit('log_time');
		}
	});
};

Simulator.prototype.put = function(api, payload) { 
	var that = this;
	rest.putJson(this.URI + api, payload).on('complete', result => {
		console.log(result);
		that.emit('log_time');
	});
}

Simulator.prototype.delete = function(api) { 
	var that = this;
	console.log(this.URI);
	rest.del(this.URI + api).on('complete', result => {
		console.log(result);
		that.emit('log_time');
	});
}

/* 
	apis to interact with resource manager
*/
Simulator.prototype.get_devices = function(api) {
	this.get(api);
	this.once('get_success', () =>{
		//console.log(this.RESPONSE);
		this.emit('log_time');
	});
}

Simulator.prototype.register_device = function(api, payload) {
	console.log("DEBUG: Registering" + api + " " + payload);
	this.post(api, payload);
	this.emit('log_time');
}

Simulator.prototype.get_device_apps = function(api, param) {
	var long_api = api + '/' + param;
	this.get(long_api);
	this.once('get_success', () =>{
		if(this.RESPONSE.device.app){
			this.RESPONSE.device.app.forEach(element =>{
				console.log(element);
				this.emit('log_time');
			});
		} else {
			console.log(this.RESPONSE);
			this.emit('log_time');
		}	
		// console.log(this.RESPONSE);
	});
}

/* 
	methods to update the database with installed, updated and deleted apps in the given device
	methods to interact with device with device specific api
	methods to connect with device to install update and remove applications
*/
// param === deviceID
Simulator.prototype.install_app = function(api, param, payload) { 
	// var long_api = api + '/' + param;
	this.post(api, payload);
	this.once('appinstalled', () => {
		this.rrURI = 'http://' + this.options.rrhost + ':' + this.options.rrport + '/';
		this.deviceURI = this.URI;
		this.URI = this.rrURI;
		payload.id = this.IMAGEID;
		var applist = [payload];
		this.post('device/' + param, applist);
		this.URI = this.deviceURI;
	});
} 

// param1 === deviceID, param2 === appID
Simulator.prototype.update_app = function(api, param1, param2, payload) { 
	var long_api = api + '/' + param1 + '/' + param2;
	this.put(long_api, payload);
	this.once('appupdated', () => {
		this.put('http://' + this.options.rrhost + ':' + this.options.rrport + '/' + 'device/' + param, payload);
	});
}

// param1 === deviceID, param2 === appID
Simulator.prototype.delete_app = function(api, param1, param2) { 
	// var long_api = api + '/' + param1 + '/' + param2;
	this.delete(api + '/' + param2);
	this.once('appdeleted', () => {
		this.rrURI = 'http://' + this.options.rrhost + ':' + this.options.rrport + '/';
		this.deviceURI = this.URI;
		this.URI = this.rrURI;
		this.delete('device/' + param1 + '/' + param2);
		this.URI = this.deviceURI
	});
}

// Timer api to log time
Simulator.prototype.timer = function() {
	this.time = process.hrtime();
	this.on('log_time', () =>{
		var time_diff = process.hrtime(this.time);
		console.log('Time taken = ' + time_diff[0] + time_diff[1]/1e9 + ' seconds');
	});
}

// Bandwidth monitor 
Simulator.prototype.bandwidth_monitor = function(){ nop();}

module.exports = Simulator;
