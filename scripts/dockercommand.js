'use strict';

var events = require('events');
var inherits = require('inherits');
var exec = require('child_process').exec;

function DockerCommand() {
	this.REMOVED_IMAGEID = null;
}
inherits(DockerCommand, events.EventEmitter);

DockerCommand.prototype.build = function(){};

DockerCommand.prototype.run = function(imagename, portmap){
	var command = exec('docker run -p ' + portmap +' -d ' + imagename , (error, stdout, stderr) => {
		// console.log('stdout: ' + stdout);
		// console.log('stderr: ' + stderr);
		if(error != null) {
			console.log('error: ' + error);
		} else {
			this.emit('imagerunning');
		}
	});	
};

DockerCommand.prototype.imageID = function(imagename){
	var command = exec('docker images ' + imagename + ' -q', (error, stdout, stderr) => {
		this.IMAGEID = stdout.trim();
		if(error != null) {
			console.log('error: ' + error);
		}
		this.emit('gotimageID');
	});
};

DockerCommand.prototype.remove_container = function(imageid){
	var that = this;
	var running_container = false;
	var containerid;
	exec('docker ps -qf ancestor=' + imageid , (error, stdout, stderr) => {
		if(stdout === "") {
			// console.log(' containers : ' + stdout);
			running_container = false;
		} else {
			// console.log(stdout);
			containerid = stdout.replace(/\n/g, " ");
			running_container = true;
		}
		if(running_container !== false){
			exec('docker stop ' + containerid, (error, stdout, stderr) => {
				// console.log('stdout: ' + stdout);
				// console.log('stderr: ' + stderr);
				if(error != null) {
					console.log('error: ' + error);
					that.emit('nocontainer');
				} 
				// else {
				// 	console.log('Removing containers');
				// 	exec('docker rm -f ' + containerid, (error, stdout, stderr) => {
				// 	// console.log('stdout: ' + stdout);
				// 	// console.log('stderr: ' + stderr);
				// 		if(error != null) {
				// 			console.log('error: ' + error);
				// 			that.emit('errorremovingcontainer')
				// 		} else {
				// 			console.log('REMOVING CONTAINER ' + containerid);
				// 			that.emit('containerremoved');
				// 		}	
				// 	});
				// }
				else {
					console.log('REMOVING CONTAINER ' + containerid);
					that.emit('containerremoved');
				}
			});
		} 
		else {
			that.emit('nocontainer');
		}
	});
};

DockerCommand.prototype.remove_image = function(imageid){
	var that = this;
	var image_exists = false;
	exec('docker inspect ' + imageid, (error, stdout, stderr) => {
		// console.log(stdout);
		if(stdout.length === 0) {
			image_exists = false;
		} else {
			image_exists = true;
		}
		if(image_exists && imageid !== this.REMOVED_IMAGEID){
			exec('docker rmi -f ' + imageid , (error, stdout, stderr) => {
				if(error != null) {
					console.log('error: ' + error);
					that.emit('errorimage');
				} else {
					that.REMOVED_IMAGEID = imageid;
					that.emit('imageremoved');
				}
			});		
		} else {
			this.emit('noimage');
		}
	});
	
	
};

DockerCommand.prototype.reset = function(imagename) {
	exec('docker restart $(docker ps -qf ancestor=' + imagename + ')', (error, stdout, stderr) => {
		if(error !== null) {
			console.log("error: " + error);
		} else {
			this.emit('restarted');
		}
	});
}

module.exports = DockerCommand;