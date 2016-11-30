'use strict';

var Simulator = require('./simulator');
var options = {
 host: 'localhost',
 port: '10012',
};
var simulate = new Simulator(options);

var image = {image: 'srijanss/gettempapp'}

if(process.argv.length < 3){
	simulate.install_app('app', 'install', image);
} else {
	simulate.delete_app('app', 'delete', process.argv[2]);
}
