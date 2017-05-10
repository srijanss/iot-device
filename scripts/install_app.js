'use strict';

var Simulator = require('./simulator');
var options = {
 host: 'localhost',
 port: '10040',
 rrhost: 'localhost',
 rrport: '10010',
};
var simulate = new Simulator(options);

var image = {image: 'srijanss/gettempapp', version: '1.0'};

simulate.timer();

if(process.argv.length < 4){
	simulate.install_app('app/install', process.argv[2], image);
} else {
	simulate.delete_app('app/delete', process.argv[2], process.argv[3]);
}
