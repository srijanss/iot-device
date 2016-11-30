'use strict';

var DockerCommand = require('../../scripts/dockercommand');
var dockercmd = new DockerCommand();

module.exports = {installapp, deleteapp};

// function run_defaultapp() {
// 	dockercmd.run('srijanss/iot-device');
// 	dockercmd.on('imagerunning', () => {
// 		console.log('Default Image Running');
// 	});
// }

// operationId for installapp and updateapp api
function installapp(req, res, next) {
	// dockercmd.remove_container();
	// dockercmd.on('containerremoved', () => {
	// 	console.log('All Containers removed');
	// 	console.log(req.body.image);
	dockercmd.run(req.body.image, '10011:10010');
	dockercmd.once('imagerunning', () => {
		dockercmd.imageID(req.body.image);
		dockercmd.once('gotimageID', () => {
			console.log(dockercmd.IMAGEID);
			res.json({'imageid': dockercmd.IMAGEID, 'status': 'Image Running'});
			// dockercmd.reset('srijanss/iot-device');
			console.log('Restart iot-device after install');
		});
	});
	// });	
}

// operationId for deleteapp api
function deleteapp(req, res, next) {
	dockercmd.remove_container(req.swagger.params.imageid.value);
	var containerremove_handler;
	var imageremove_handler;
	var nocontainer_handler;
	var noimage_handler;
	dockercmd.once('containerremoved', containerremove_handler = function (){
		dockercmd.remove_image(req.swagger.params.imageid.value);
		console.log("IMAGE : " + req.swagger.params.imageid.value);
		dockercmd.removeListener('nocontainer', nocontainer_handler);
		
	});
	dockercmd.once('imageremoved', imageremove_handler = function (){
		res.json({'success': 1, 'description': 'Image removed successfully'});
		// dockercmd.reset('srijanss/iot-device');
		console.log('Restart iot-device after removal');
		dockercmd.removeListener('noimage', noimage_handler);
		// run_defaultapp();
	});	
	dockercmd.once('nocontainer', nocontainer_handler = function (){
		// dockercmd.remove_image(req.swagger.params.imageid.value);
		console.log("NOCONTAINER : " + req.swagger.params.imageid.value);
		res.json({'success': 1, 'description': 'Image doesnot exists'});
		dockercmd.removeListener('containerremoved', containerremove_handler);
		dockercmd.removeListener('noimage', noimage_handler);
		dockercmd.removeListener('imageremoved', imageremove_handler);
		// dockercmd.once('imageremoved', () => {
		// 	res.json({'success': 1, 'description': 'Image removed successfully'});
		// 	// dockercmd.reset('srijanss/iot-device');
		// 	console.log('Restart iot-device after install');
		// 	// run_defaultapp();
		// });	
	});
	dockercmd.once('noimage', noimage_handler = function (){
		res.json({'success': 1, 'description': 'Image doesnot exists'});
		dockercmd.removeListener('containerremoved', containerremove_handler);
		dockercmd.removeListener('imageremoved', imageremove_handler);
		dockercmd.removeListener('nocontainer', nocontainer_handler);
	});
	// dockercmd.once('errorremovingcontainer', () => {
	// 	res.json({'success': 0, 'description': 'Error removing container'});
	// });
}